'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Phone, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function MockPaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [step, setStep] = useState<'phone' | 'mpin' | 'otp' | 'processing' | 'success' | 'failed'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [mpin, setMpin] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const method = searchParams.get('method')
  const pidx = searchParams.get('pidx')
  const orderId = searchParams.get('orderId')
  const amount = searchParams.get('amount')

  useEffect(() => {
    if (!method || !pidx || !orderId) {
      router.push('/cart')
    }
  }, [method, pidx, orderId, router])

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber) {
      setError('Please enter your phone number')
      return
    }
    setStep('mpin')
    setError('')
  }

  const handleMpinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mpin !== '1111') {
      setError('Invalid MPIN. Please try again.')
      return
    }
    setStep('otp')
    setError('')
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Simulate OTP verification
      if (otp !== '987654') {
        throw new Error('Invalid OTP')
      }

      setStep('processing')
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Verify payment with our mock API
      const verifyResponse = await fetch(`/api/mock-payment/khalti?pidx=${pidx}&orderId=${orderId}&amount=${amount}&method=khalti`)
      
      if (verifyResponse.ok) {
        const result = await verifyResponse.json()
        if (result.status === 'success') {
          setStep('success')
          setSuccessMessage(result.message)
        } else {
          throw new Error(result.message || 'Payment verification failed')
        }
      } else {
        throw new Error('Payment verification failed')
      }
    } catch (err) {
      setStep('failed')
      setError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  const renderPhoneStep = () => (
    <form onSubmit={handlePhoneSubmit} className="space-y-4">
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            placeholder="98XXXXXXXX"
            className="pl-10"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Enter your Khalti registered phone number
        </p>
      </div>
      <Button type="submit" className="w-full">
        Continue
      </Button>
    </form>
  )

  const renderMpinStep = () => (
    <form onSubmit={handleMpinSubmit} className="space-y-4">
      <div>
        <Label htmlFor="mpin">MPIN</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="mpin"
            type="password"
            placeholder="Enter 4-digit MPIN"
            className="pl-10"
            value={mpin}
            onChange={(e) => setMpin(e.target.value)}
            maxLength={4}
            required
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Enter your Khalti MPIN (Test MPIN: 1111)
        </p>
      </div>
      <Button type="submit" className="w-full">
        Verify MPIN
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        className="w-full"
        onClick={() => setStep('phone')}
      >
        Back
      </Button>
    </form>
  )

  const renderOtpStep = () => (
    <form onSubmit={handleOtpSubmit} className="space-y-4">
      <div>
        <Label htmlFor="otp">OTP</Label>
        <Input
          id="otp"
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Enter the OTP sent to your phone (Test OTP: 987654)
        </p>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify OTP'
        )}
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        className="w-full"
        onClick={() => setStep('mpin')}
      >
        Back
      </Button>
    </form>
  )

  const renderProcessingStep = () => (
    <div className="text-center space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
      <h3 className="text-xl font-semibold">Processing Payment</h3>
      <p className="text-muted-foreground">
        Please wait while we process your payment...
      </p>
    </div>
  )

  const renderSuccessStep = () => (
    <div className="text-center space-y-4">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
      <h3 className="text-2xl font-bold text-green-600">Payment Successful!</h3>
      <p className="text-muted-foreground">
        {successMessage}
      </p>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-700">
          Transaction ID: txn_verified_{Date.now()}
        </p>
        <p className="text-sm text-green-700">
          Amount: NPR {amount}
        </p>
      </div>
      <Button 
        onClick={() => router.push(`/success?method=khalti&pidx=${pidx}&orderId=${orderId}`)}
        className="w-full"
      >
        Continue to Order Summary
      </Button>
    </div>
  )

  const renderFailedStep = () => (
    <div className="text-center space-y-4">
      <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
      <h3 className="text-2xl font-bold text-red-600">Payment Failed</h3>
      <p className="text-muted-foreground">
        {error}
      </p>
      <div className="space-y-2">
        <Button 
          onClick={() => router.push('/cart')}
          variant="outline"
          className="w-full"
        >
          Return to Cart
        </Button>
        <Button 
          onClick={() => {
            setStep('phone')
            setError('')
            setPhoneNumber('')
            setMpin('')
            setOtp('')
          }}
          className="w-full"
        >
          Try Again
        </Button>
      </div>
    </div>
  )

  const getStepTitle = () => {
    switch (step) {
      case 'phone': return 'Enter Phone Number'
      case 'mpin': return 'Enter MPIN'
      case 'otp': return 'Enter OTP'
      case 'processing': return 'Processing Payment'
      case 'success': return 'Payment Successful'
      case 'failed': return 'Payment Failed'
      default: return 'Complete Payment'
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-foreground">K</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Khalti Payment</h1>
          <p className="text-muted-foreground">
            Complete your payment securely
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{getStepTitle()}</CardTitle>
            <CardDescription>
              {step !== 'success' && step !== 'failed' && (
                `Amount: NPR ${amount || '0'}`
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            {step === 'phone' && renderPhoneStep()}
            {step === 'mpin' && renderMpinStep()}
            {step === 'otp' && renderOtpStep()}
            {step === 'processing' && renderProcessingStep()}
            {step === 'success' && renderSuccessStep()}
            {step === 'failed' && renderFailedStep()}
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>This is a demo payment interface for educational purposes</p>
          <p className="mt-1">Test Credentials: MPIN: 1111, OTP: 987654</p>
        </div>
      </div>
    </div>
  )
}