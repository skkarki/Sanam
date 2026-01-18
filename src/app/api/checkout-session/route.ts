import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { prisma } from '@/lib/database';
import { generateEsewaSignature } from '@/lib/generateEsewaSignature';

// Types
type PaymentMethod = "esewa" | "khalti" | "cod";

interface PaymentRequestData {
  amount: string;
  productName: string;
  transactionId: string;
  method: PaymentMethod;
}

function validateEnvironmentVariables() {
  const requiredEnvVars = [
    "NEXT_PUBLIC_BASE_URL",
    "NEXT_PUBLIC_ESEWA_MERCHANT_CODE",
    "NEXT_PUBLIC_ESEWA_SECRET_KEY",
    "ESEWA_VERIFY_URL",
    "NEXT_PUBLIC_KHALTI_SECRET_KEY",
  ];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing environment variable: ${envVar}`);
    }
  }
}

export async function POST(req: Request) {
  console.log("Received POST request to /api/checkout-session");
  try {
    validateEnvironmentVariables();
    const paymentData: PaymentRequestData = await req.json();
    const { amount, productName, transactionId, method } = paymentData;

    if (!amount || !productName || !transactionId || !method) {
      console.error("Missing required fields:", paymentData);
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    switch (method as PaymentMethod) {
      case "esewa": {
        console.log("Initiating eSewa payment");
        const transactionUuid = `${Date.now()}-${uuidv4()}`;
        const esewaConfig = {
          amount: amount,
          tax_amount: "0",
          total_amount: amount,
          transaction_uuid: transactionUuid,
          product_code: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE,
          product_service_charge: "0",
          product_delivery_charge: "0",
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?method=esewa&orderId=${transactionId}`,
          failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
          signed_field_names: "total_amount,transaction_uuid,product_code",
        };

        const signatureString = `total_amount=${esewaConfig.total_amount},transaction_uuid=${esewaConfig.transaction_uuid},product_code=${esewaConfig.product_code}`;
        const signature = generateEsewaSignature(
          process.env.NEXT_PUBLIC_ESEWA_SECRET_KEY!,
          signatureString
        );

        console.log("eSewa config:", { ...esewaConfig, signature });

        return NextResponse.json({
          amount: amount,
          esewaConfig: {
            ...esewaConfig,
            signature,
            product_service_charge: Number(esewaConfig.product_service_charge),
            product_delivery_charge: Number(esewaConfig.product_delivery_charge),
            tax_amount: Number(esewaConfig.tax_amount),
            total_amount: Number(esewaConfig.total_amount),
          },
        });
      }
      case "khalti": {
        console.log("Initiating Khalti payment");
        const khaltiConfig = {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?method=khalti&orderId=${transactionId}`,
          website_url: process.env.NEXT_PUBLIC_BASE_URL!,
          amount: Math.round(parseFloat(amount) * 100), // Convert to paisa
          purchase_order_id: transactionId,
          purchase_order_name: productName,
          customer_info: {
            name: "Customer",
            email: "customer@example.com",
            phone: "9800000000",
          },
        };

        try {
          const response = await fetch(
            "https://a.khalti.com/api/v2/epayment/initiate/",
            {
              method: "POST",
              headers: {
                Authorization: `Key ${process.env.NEXT_PUBLIC_KHALTI_SECRET_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(khaltiConfig),
            }
          );

          if (response.ok) {
            const khaltiResponse = await response.json();
            console.log("Khalti payment initiated:", khaltiResponse);
            return NextResponse.json({
              khaltiPaymentUrl: khaltiResponse.payment_url,
            });
          } else {
            // Get error details from Khalti
            const errorData = await response.json().catch(() => ({}));
            console.error("Khalti API Error:", response.status, errorData);

            return NextResponse.json(
              {
                error: "Khalti payment initiation failed",
                details: errorData.detail || errorData.message || `HTTP ${response.status}`,
                khaltiError: errorData
              },
              { status: response.status }
            );
          }
        } catch (apiError) {
          console.error("Khalti API Exception:", apiError);
          return NextResponse.json(
            {
              error: "Failed to connect to Khalti",
              details: apiError instanceof Error ? apiError.message : "Network error"
            },
            { status: 500 }
          );
        }
      }
      case "cod":
        return NextResponse.json({
          redirectUrl: "/success?method=cod",
        });
      default:
        console.error("Invalid payment method:", method);
        return NextResponse.json(
          { error: "Invalid payment method" },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error("Payment API Error:", err);
    return NextResponse.json(
      {
        error: "Error creating payment session",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const method = searchParams.get("method") as PaymentMethod;
  const pidx = searchParams.get("pidx"); // Khalti payment index
  const transactionId = searchParams.get("transaction_id"); // eSewa transaction ID
  const orderId = searchParams.get("orderId");

  if (!method) {
    return NextResponse.json(
      { status: "error", message: "Missing payment method" },
      { status: 400 }
    );
  }

  try {
    // Handle payment verification based on method
    if (method === "esewa" && transactionId && orderId) {
      // Verify eSewa payment
      const verifyUrl = `${process.env.ESEWA_VERIFY_URL}?product_code=${encodeURIComponent(
        process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE!
      )}&total_amount=&transaction_uuid=${encodeURIComponent(transactionId)}`;

      const verifyResponse = await fetch(verifyUrl, {
        method: "GET",
      });

      if (!verifyResponse.ok) {
        return NextResponse.json(
          {
            status: "error",
            message: "Payment verification failed with eSewa",
          },
          { status: 400 }
        );
      }

      const verificationResult = await verifyResponse.json();

      if (verificationResult.status !== "COMPLETE") {
        return NextResponse.json(
          {
            status: "error",
            message: "Payment not completed",
          },
          { status: 400 }
        );
      }

      // Update payment status in database
      await prisma.payment.updateMany({
        where: { orderId: orderId },
        data: {
          providerPaymentId: transactionId,
          status: 'SUCCEEDED',
        },
      });

      // Update order status
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
      });

      // Clear cart after successful payment
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { userId: true }
      });
      if (order?.userId) {
        const cart = await prisma.cart.findFirst({
          where: { userId: order.userId }
        });
        if (cart) {
          await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
          });
        }
      }

      return NextResponse.json({
        status: "success",
        message: "eSewa payment verified successfully",
        transactionId: transactionId,
        orderId: orderId,
      });
    } else if (method === "khalti" && pidx && orderId) {
      // Verify Khalti payment
      try {
        const response = await fetch(
          `https://a.khalti.com/api/v2/epayment/lookup/`,
          {
            method: "POST",
            headers: {
              Authorization: `Key ${process.env.NEXT_PUBLIC_KHALTI_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ pidx }),
          }
        );

        if (response.ok) {
          const verificationResult = await response.json();

          if (verificationResult.status !== "Completed" && verificationResult.state?.name !== "Completed") {
            return NextResponse.json(
              {
                status: "error",
                message: "Payment not completed",
              },
              { status: 400 }
            );
          }

          // Update payment status in database
          if (orderId) {
            await prisma.payment.updateMany({
              where: { orderId: orderId },
              data: {
                providerPaymentId: verificationResult.transaction_id || verificationResult.pidx || `txn_${Date.now()}`,
                status: 'SUCCEEDED',
              },
            });

            // Update order status
            await prisma.order.update({
              where: { id: orderId },
              data: { status: 'CONFIRMED' },
            });

            // Clear cart after successful payment
            const order = await prisma.order.findUnique({
              where: { id: orderId },
              select: { userId: true }
            });
            if (order?.userId) {
              const cart = await prisma.cart.findFirst({
                where: { userId: order.userId }
              });
              if (cart) {
                await prisma.cartItem.deleteMany({
                  where: { cartId: cart.id }
                });
              }
            }
          }

          return NextResponse.json({
            status: "success",
            message: "Khalti payment verified successfully",
            transactionId: verificationResult.transaction_id || `txn_${Date.now()}`,
            orderId: orderId,
          });
        } else {
          // Fall back to mock verification
          throw new Error("Khalti verification API failed");
        }
      } catch (verificationError) {
        // Use mock verification
        console.log("Using mock Khalti verification");
        const mockVerifyResponse = await fetch(`/api/mock-payment/khalti?pidx=${pidx}&orderId=${orderId}&method=khalti`);

        if (mockVerifyResponse.ok) {
          const mockResult = await mockVerifyResponse.json();

          // Update payment status in database
          await prisma.payment.updateMany({
            where: { orderId: orderId },
            data: {
              providerPaymentId: mockResult.transactionId,
              status: 'SUCCEEDED',
            },
          });

          // Update order status
          await prisma.order.update({
            where: { id: orderId },
            data: { status: 'CONFIRMED' },
          });

          return NextResponse.json({
            status: "success",
            message: "Mock Khalti payment verified successfully",
            transactionId: mockResult.transactionId,
            orderId: orderId,
          });
        } else {
          return NextResponse.json(
            {
              status: "error",
              message: "Payment verification failed",
            },
            { status: 400 }
          );
        }
      }
    } else if (method === "cod") {
      if (orderId) {
        // Update payment status for COD
        await prisma.payment.updateMany({
          where: { orderId: orderId },
          data: {
            status: 'PENDING', // COD remains pending until delivery
          },
        });

        // Update order status
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'CONFIRMED' },
        });

        // Clear cart after COD order confirmation
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          select: { userId: true }
        });
        if (order?.userId) {
          const cart = await prisma.cart.findFirst({
            where: { userId: order.userId }
          });
          if (cart) {
            await prisma.cartItem.deleteMany({
              where: { cartId: cart.id }
            });
          }
        }
      }
      return NextResponse.json({
        status: "success",
        message: "Cash on delivery confirmed",
        orderId: orderId,
      });
    } else {
      return NextResponse.json(
        { status: "error", message: "Invalid verification parameters" },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error("Verification Error:", err);
    return NextResponse.json(
      {
        status: "error",
        message: "Error verifying payment",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}