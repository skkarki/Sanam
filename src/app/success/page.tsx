'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<'checking' | 'success' | 'failed' | 'pending'>('checking');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const method = searchParams.get('method');
  const pidx = searchParams.get('pidx'); // Khalti payment index
  const transactionId = searchParams.get('transaction_id'); // eSewa transaction ID
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!method) {
        setPaymentStatus('failed');
        setErrorMessage('Payment method not specified');
        return;
      }

      // If it's COD, we don't need verification
      if (method === 'cod') {
        setPaymentStatus('success');
        return;
      }

      // Verify payment with our backend
      try {
        const params = new URLSearchParams();
        params.append('method', method);
        
        if (pidx) params.append('pidx', pidx);
        if (transactionId) params.append('transaction_id', transactionId);
        if (orderId) params.append('orderId', orderId);

        const response = await fetch(`/api/checkout-session?${params.toString()}`, {
          method: 'GET',
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
          setPaymentStatus('success');
          setOrderDetails(data);
        } else {
          setPaymentStatus('failed');
          setErrorMessage(data.message || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setPaymentStatus('failed');
        setErrorMessage('Error verifying payment');
      }
    };

    // Add a small delay to allow URL parameters to be processed
    const timer = setTimeout(() => {
      verifyPayment();
    }, 1000);

    return () => clearTimeout(timer);
  }, [method, pidx, transactionId, orderId]);

  const getStatusContent = () => {
    switch (paymentStatus) {
      case 'checking':
        return {
          icon: <Clock className="h-16 w-16 text-blue-500" />,
          title: 'Verifying Payment...',
          message: 'Please wait while we verify your payment.',
          button: null,
        };
      case 'success':
        return {
          icon: <Check className="h-16 w-16 text-green-500" />,
          title: 'Payment Successful!',
          message: `Thank you for your payment via ${method?.toUpperCase()}. Your order has been confirmed.`,
          button: (
            <div className="flex gap-4">
              <Link href="/orders">
                <Button variant="default">View Order</Button>
              </Link>
              <Link href="/products">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
            </div>
          ),
        };
      case 'failed':
        return {
          icon: <AlertCircle className="h-16 w-16 text-red-500" />,
          title: 'Payment Failed',
          message: errorMessage || 'Your payment could not be processed. Please try again.',
          button: (
            <div className="flex gap-4">
              <Link href="/cart">
                <Button variant="default">Return to Cart</Button>
              </Link>
              <Link href="/checkout">
                <Button variant="outline">Try Again</Button>
              </Link>
            </div>
          ),
        };
      case 'pending':
        return {
          icon: <Clock className="h-16 w-16 text-yellow-500" />,
          title: 'Payment Pending',
          message: 'Your payment is being processed. Please check back later.',
          button: (
            <div className="flex gap-4">
              <Link href="/orders">
                <Button variant="default">Check Order Status</Button>
              </Link>
              <Link href="/">
                <Button variant="outline">Go Home</Button>
              </Link>
            </div>
          ),
        };
      default:
        return {
          icon: <Clock className="h-16 w-16 text-blue-500" />,
          title: 'Verifying Payment...',
          message: 'Please wait while we verify your payment.',
          button: null,
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {statusContent.icon}
            </div>
            <CardTitle className="text-2xl">{statusContent.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground">
              {statusContent.message}
            </p>
            
            {orderDetails && orderDetails.transactionId && (
              <div className="bg-gray-100 p-3 rounded-md text-sm">
                <p className="font-medium">Transaction ID: {orderDetails.transactionId}</p>
              </div>
            )}

            {statusContent.button}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}