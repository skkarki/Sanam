import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Truck, Package, Clock, Shield } from 'lucide-react'

export default function ShippingInfoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Shipping Information</h1>
        <p className="text-xl text-muted-foreground">
          Everything you need to know about delivery at Sanam International
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Methods */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-6 w-6 text-primary" />
                Shipping Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Standard Delivery</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Delivery Time:</span>
                    <span className="font-medium">3-5 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Free Shipping:</span>
                    <span className="font-medium text-green-600">On orders over Rs. 10,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost:</span>
                    <span className="font-medium">Rs. 500 (under Rs. 10,000)</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Express Delivery</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Delivery Time:</span>
                    <span className="font-medium">1-2 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Free Shipping:</span>
                    <span className="font-medium text-green-600">On orders over Rs. 25,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost:</span>
                    <span className="font-medium">Rs. 1,500</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-primary/5">
                <h3 className="font-semibold mb-3">Same-Day Delivery (Kathmandu Valley Only)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Delivery Time:</span>
                    <span className="font-medium">Same day for orders before 2 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Free Shipping:</span>
                    <span className="font-medium text-green-600">Always free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost:</span>
                    <span className="font-medium">Rs. 2,500</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delivery Areas */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Delivery Areas</CardTitle>
              <CardDescription>
                We ship nationwide across Nepal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Major Cities</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Same-day or next-day delivery available for:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <div className="border rounded p-2">Kathmandu</div>
                  <div className="border rounded p-2">Lalitpur</div>
                  <div className="border rounded p-2">Bhaktapur</div>
                  <div className="border rounded p-2">Pokhara</div>
                  <div className="border rounded p-2">Biratnagar</div>
                  <div className="border rounded p-2">Bharatpur</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Standard Delivery</h4>
                <p className="text-sm text-muted-foreground">
                  3-5 business days to all locations outside Kathmandu Valley
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">International Shipping</h4>
                <p className="text-sm text-muted-foreground">
                  We currently do not offer international shipping. All orders are delivered within Nepal only.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tracking Orders */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Track Your Order</CardTitle>
              <CardDescription>
                Enter your order number to track your shipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter your order number (e.g., ORD-20250120-7K3M)"
                  className="flex-1 border rounded-lg px-4 py-3"
                />
                <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90">
                  Track Order
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipping FAQ */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">How do I calculate my delivery date?</h4>
                <p className="text-sm text-muted-foreground">
                  Add 3-5 business days to your order confirmation date for standard delivery. Express delivery arrives in 1-2 business days.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">What happens if I'm not home for delivery?</h4>
                <p className="text-sm text-muted-foreground">
                  Our delivery partner will attempt delivery twice. If unsuccessful, your package will be held at a local pickup point for 3 days.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">Can I change my delivery address after placing an order?</h4>
                <p className="text-sm text-muted-foreground">
                  Address changes can be made within 2 hours of order placement by contacting our customer service team at <a href="tel:+977-9865-4321" className="text-primary hover:underline">+977-9865-4321</a>.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">Do you ship on weekends and holidays?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, we deliver on all days including weekends and public holidays, though delivery times may be slightly longer during holidays.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Packaging */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                Packaging & Handling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Secure Packaging</h4>
                <p className="text-sm text-muted-foreground">
                  All packages are securely sealed and tamper-evident. We use eco-friendly packaging materials where possible.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">Fragile Items</h4>
                <p className="text-sm text-muted-foreground">
                  Fragile items are specially marked and handled with extra care. Additional packaging may be used for maximum protection.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">Signature Required</h4>
                <p className="text-sm text-muted-foreground">
                  A signature may be required for orders above Rs. 50,000 to ensure successful delivery.
                </p>
              </div>
              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">Lost or Damaged Packages</h4>
                <p className="text-sm text-muted-foreground">
                  If your package is lost or arrives damaged, please contact us within 48 hours. We will arrange for replacement or full refund.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-12 bg-primary/5 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-3">Ready to place an order?</h3>
        <p className="text-muted-foreground mb-6">
          Browse our collection and find your perfect style
        </p>
        <a
          href="/products"
          className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Shop Now
        </a>
      </div>
    </div>
  )
}
