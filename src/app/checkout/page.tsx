'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  ArrowLeft, 
  ArrowRight, 
  CreditCard, 
  Truck, 
  Check,
  Loader2,
  ShoppingCart,
  MapPin,
  Package
} from 'lucide-react'
import { useCartStore } from '@/hooks/use-cart-store'
import { formatPrice } from '@/lib/utils'

type CheckoutStep = 'shipping' | 'payment' | 'review'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, fetchCart, isLoading: isCartLoading, clearCart } = useCartStore()
  
  const [submitting, setSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Nepal',
  })

  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [saveAddress, setSaveAddress] = useState(false)

  // Fetch cart on mount if empty
  useEffect(() => {
    if (items.length === 0) {
      fetchCart()
    }
  }, [fetchCart, items.length])

  // Redirect if cart is empty (and not loading)
  useEffect(() => {
    if (!isCartLoading && items.length === 0 && !orderPlaced) {
      // Use a small timeout to allow fetchCart to complete if it was just called
      const timer = setTimeout(() => {
        if (items.length === 0) {
            // Check if we are not already on cart or products page to avoid loops if something is wrong
             // router.push('/cart') 
             // Logic: If user is on checkout and cart is empty, send to cart page.
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isCartLoading, items.length, orderPlaced, router])
  
  // Computed values
  const subtotal = items.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const shippingCost = subtotal >= 10000 ? 0 : 200
  const total = subtotal + shippingCost

  const validateShipping = () => {
    return (
      shippingInfo.firstName &&
      shippingInfo.lastName &&
      shippingInfo.email &&
      shippingInfo.phone &&
      shippingInfo.address &&
      shippingInfo.city
    )
  }

  const handlePlaceOrder = async () => {
    setSubmitting(true)
    try {
      if (paymentMethod === 'esewa' || paymentMethod === 'khalti') {
        // For eSewa and Khalti, we need to create a payment session first
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shippingAddress: shippingInfo,
            paymentMethod,
            saveAddress,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.error || 'Failed to create order');
          setSubmitting(false);
          return;
        }

        // Create payment session for eSewa or Khalti
        const paymentSessionResponse = await fetch('/api/checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total.toString(),
            productName: `Order #${data.orderNumber}`,
            transactionId: data.orderId,
            method: paymentMethod,
          }),
        });

        const paymentSessionData = await paymentSessionResponse.json();

        if (!paymentSessionResponse.ok) {
          alert(paymentSessionData.error || 'Failed to initiate payment');
          setSubmitting(false);
          return;
        }

        // Redirect to payment gateway
        if (paymentMethod === 'esewa' && paymentSessionData.esewaConfig) {
          // Create form and submit for eSewa
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
          form.target = '_blank';
          
          const fields = {
            ...paymentSessionData.esewaConfig,
          };
          
          for (const [key, value] of Object.entries(fields)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = String(value);
            form.appendChild(input);
          }
          
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
          
          // Update payment status
          await updatePaymentStatus(data.orderId, 'PENDING');
        } else if (paymentMethod === 'khalti' && paymentSessionData.khaltiPaymentUrl) {
          window.location.href = paymentSessionData.khaltiPaymentUrl;
        }
      } else {
        // For COD, just place the order directly
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shippingAddress: shippingInfo,
            paymentMethod,
            saveAddress,
          }),
        })

        const data = await response.json()

        if (response.ok) {
          setOrderPlaced(true)
          setOrderId(data.orderNumber)
          // Refresh cart store (should be empty now)
          fetchCart()
        } else {
          alert(data.error || 'Failed to place order')
        }
      }
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  
  const updatePaymentStatus = async (orderId: string, status: string) => {
    // This would be implemented to update the payment status in the database
    // For now, it's a placeholder
    console.log(`Updating payment status for order ${orderId} to ${status}`);
  }

  const steps = [
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'review', label: 'Review', icon: Package },
  ]

  if (isCartLoading && items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }
  
  // Show empty cart message if not loading and empty (and order not placed)
  if (!isCartLoading && items.length === 0 && !orderPlaced) {
     return (
       <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <Link href="/products">
            <Button size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
     )
  }

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mb-2">
            Thank you for your order. Your order number is:
          </p>
          <p className="text-2xl font-bold text-primary mb-6">{orderId}</p>
          <p className="text-muted-foreground mb-8">
            We've sent a confirmation email to {shippingInfo.email}. 
            You can track your order status in your profile.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
            <Link href="/profile">
              <Button>View Order</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/cart" className="text-muted-foreground hover:text-foreground flex items-center gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold">Checkout</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div 
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                currentStep === step.id 
                  ? 'bg-primary text-primary-foreground' 
                  : steps.findIndex(s => s.id === currentStep) > index
                    ? 'bg-green-100 text-green-700'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              <step.icon className="h-5 w-5" />
              <span className="hidden sm:inline font-medium">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-1 mx-2 ${
                steps.findIndex(s => s.id === currentStep) > index
                  ? 'bg-green-500'
                  : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-2">
          {/* Shipping Step */}
          {currentStep === 'shipping' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    placeholder="+977-98XXXXXXXX"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    placeholder="Street address, apartment, etc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      placeholder="Kathmandu"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                      placeholder="Bagmati"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                      placeholder="44600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={shippingInfo.country}
                      disabled
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={() => setCurrentStep('payment')}
                    disabled={!validateShipping()}
                  >
                    Continue to Payment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Step */}
          {currentStep === 'payment' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-4 p-4 border rounded-lg hover:border-primary cursor-pointer">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="font-medium">Cash on Delivery</div>
                      <div className="text-sm text-muted-foreground">
                        Pay when you receive your order
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-4 p-4 border rounded-lg hover:border-primary cursor-pointer">
                    <RadioGroupItem value="esewa" id="esewa" />
                    <Label htmlFor="esewa" className="flex-1 cursor-pointer">
                      <div className="font-medium">eSewa</div>
                      <div className="text-sm text-muted-foreground">
                        Pay using eSewa digital wallet
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-4 p-4 border rounded-lg hover:border-primary cursor-pointer">
                    <RadioGroupItem value="khalti" id="khalti" />
                    <Label htmlFor="khalti" className="flex-1 cursor-pointer">
                      <div className="font-medium">Khalti</div>
                      <div className="text-sm text-muted-foreground">
                        Pay using Khalti digital wallet
                      </div>
                    </Label>
                  </div>

                </RadioGroup>

                <div className="flex gap-4 pt-4">
                  <Button 
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentStep('shipping')}
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                  </Button>
                  <Button 
                    size="lg" 
                    className="flex-1"
                    onClick={() => setCurrentStep('review')}
                  >
                    Review Order
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Review Step */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              {/* Shipping Summary */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentStep('shipping')}>
                    Edit
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                  <p className="text-muted-foreground">{shippingInfo.address}</p>
                  <p className="text-muted-foreground">
                    {shippingInfo.city}{shippingInfo.state ? `, ${shippingInfo.state}` : ''} {shippingInfo.postalCode}
                  </p>
                  <p className="text-muted-foreground">{shippingInfo.country}</p>
                  <p className="text-muted-foreground mt-2">{shippingInfo.phone}</p>
                  <p className="text-muted-foreground">{shippingInfo.email}</p>
                </CardContent>
              </Card>

              {/* Payment Summary */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentStep('payment')}>
                    Edit
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">
                    {paymentMethod === 'cod' && 'Cash on Delivery'}
                    {paymentMethod === 'esewa' && 'eSewa'}
                    {paymentMethod === 'khalti' && 'Khalti'}
                  </p>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Items ({itemCount})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 bg-muted rounded overflow-hidden">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.variant.colorName} / {item.variant.sizeValue} x {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          {formatPrice(item.variant.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the Terms of Service and Privacy Policy
                </Label>
              </div>

              {/* Place Order Button */}
              <div className="flex gap-4">
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => setCurrentStep('payment')}
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>
                <Button 
                  size="lg" 
                  className="flex-1"
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order - {formatPrice(total)}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items Preview */}
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">
                      Rs. {(item.variant.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    <span>{formatPrice(shippingCost)}</span>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
