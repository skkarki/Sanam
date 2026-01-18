import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// Mock Khalti test credentials and responses for demonstration
const MOCK_KHALTI_SECRET = "mock_test_secret_key_12345";
const TEST_PHONE_NUMBERS = [
  "9800000000", "9800000001", "9800000002", 
  "9800000003", "9800000004", "9800000005"
];
const TEST_MPIN = "1111";
const TEST_OTP = "987654";

export async function POST(req: Request) {
  try {
    const paymentData = await req.json();
    const { amount, productName, transactionId, method, customerPhone } = paymentData;

    console.log("Mock Khalti Payment Request:", {
      amount,
      productName,
      transactionId,
      method,
      customerPhone
    });

    // Validate required fields
    if (!amount || !productName || !transactionId || !method) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // For demonstration, we'll simulate successful payment
    // In a real scenario, you'd validate against actual Khalti API
    
    // Generate mock payment URL and data
    const mockPidx = `pidx_${uuidv4()}`;
    const mockTransactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate payment URL that would redirect to Khalti
    const mockPaymentUrl = `http://localhost:3001/mock-payment?method=khalti&pidx=${mockPidx}&orderId=${transactionId}&amount=${amount}`;

    console.log("Generated Mock Payment Response:", {
      payment_url: mockPaymentUrl,
      pidx: mockPidx,
      transaction_id: mockTransactionId
    });

    return NextResponse.json({
      payment_url: mockPaymentUrl,
      pidx: mockPidx,
      transaction_id: mockTransactionId,
      status: "Initiated",
      message: "Mock payment initiated successfully"
    });

  } catch (err) {
    console.error("Mock Payment API Error:", err);
    return NextResponse.json(
      {
        error: "Error creating mock payment session",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Mock verification endpoint
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const method = searchParams.get("method");
  const pidx = searchParams.get("pidx");
  const orderId = searchParams.get("orderId");

  console.log("Mock Payment Verification Request:", {
    method,
    pidx,
    orderId
  });

  if (method === "khalti" && pidx && orderId) {
    // Simulate successful verification
    const mockVerificationResult = {
      status: "completed",
      transaction_id: `txn_verified_${Date.now()}`,
      amount: searchParams.get("amount") || "1000",
      message: "Mock payment verified successfully"
    };

    console.log("Mock Verification Result:", mockVerificationResult);

    return NextResponse.json({
      status: "success",
      message: "Mock Khalti payment verified successfully",
      transactionId: mockVerificationResult.transaction_id,
      orderId: orderId,
      verification_status: mockVerificationResult.status,
      verified_amount: mockVerificationResult.amount
    });
  }

  return NextResponse.json(
    { status: "error", message: "Invalid verification parameters" },
    { status: 400 }
  );
}