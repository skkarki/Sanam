'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { RefreshCw, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Returns & Exchanges</h1>
        <p className="text-xl text-muted-foreground">
          Our hassle-free return policy at Sanam International
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Return Policy */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-6 w-6 text-primary" />
                30-Day Return Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground mb-4">
                At Sanam International, we want you to be completely satisfied with your purchase. If you're not happy for any reason, you can return your items within 30 days of delivery.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Items must be unworn and unwashed</h4>
                    <p className="text-sm text-muted-foreground">
                      All returned items must be in their original condition with tags attached.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Original packaging required</h4>
                    <p className="text-sm text-muted-foreground">
                      Please return items in their original packaging when possible.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Proof of purchase required</h4>
                    <p className="text-sm text-muted-foreground">
                      Please include your order confirmation or receipt with your return.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Return shipping costs Rs. 200</h4>
                    <p className="text-sm text-muted-foreground">
                      A flat return shipping fee of Rs. 200 applies to all returns. This will be deducted from your refund amount.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How to Return */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>How to Return</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">1. Initiate Return</h4>
                <p className="text-sm text-muted-foreground">
                  Log in to your account and go to "My Orders" or contact our customer service team at <a href="tel:+977-9865-4321" className="text-primary hover:underline">+977-9865-4321</a>.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">2. Receive Return Authorization</h4>
                <p className="text-sm text-muted-foreground">
                  You'll receive a return authorization number (RAN) via email within 24 hours.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">3. Package Your Items</h4>
                <p className="text-sm text-muted-foreground">
                  Pack all items securely in their original packaging. Write your RAN on the outside of the package.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">4. Ship Your Return</h4>
                <p className="text-sm text-muted-foreground">
                  Send your package via our partnered courier service. Use the provided return shipping label for fastest processing.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">5. Receive Refund</h4>
                <p className="text-sm text-muted-foreground">
                  Once we receive and inspect your return, your refund will be processed within 5-7 business days.
                </p>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" size="lg">
            Start a Return
          </Button>
        </div>

        {/* Exchange Policy */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-6 w-6 text-primary" />
                Exchanges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">
                Want a different size or color? We offer free exchanges on all items within 30 days of delivery.
              </p>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Exchange Process</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Initiate exchange through your account or customer service</li>
                  <li>Select your preferred size or color</li>
                  <li>Return original item using the return shipping label</li>
                  <li>We'll ship your new item immediately upon receiving the return</li>
                  <li>No additional shipping fee for exchanges</li>
                </ol>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Exchange Availability</h4>
                <p className="text-sm text-muted-foreground">
                  Exchanges are subject to stock availability. If your preferred item is out of stock, we'll offer you alternative options or a full refund.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Non-Returnable Items */}
        <div>
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-6 w-6" />
                Non-Returnable Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                The following items cannot be returned or exchanged:
              </p>

              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span className="text-muted-foreground">
                    Personalized items (names, monograms, etc.)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span className="text-muted-foreground">
                    Final sale items (discounts above 70%)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span className="text-muted-foreground">
                    Intimate apparel (underwear, swimwear, etc.)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span className="text-muted-foreground">
                    Items worn, washed, or damaged
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span className="text-muted-foreground">
                    Items without original tags
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Refund Policy */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Refund Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Refund Method</h4>
                <p className="text-sm text-muted-foreground">
                  Refunds are processed to the original payment method used for purchase.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">Refund Timeline</h4>
                <p className="text-sm text-muted-foreground">
                  Refunds are processed within 5-7 business days after we receive and inspect your return. Depending on your payment method, it may take additional 3-5 business days for the amount to appear in your account.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">Return Shipping Deduction</h4>
                <p className="text-sm text-muted-foreground">
                  Rs. 200 return shipping fee will be deducted from your refund amount. The original shipping cost is non-refundable.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">Partial Refunds</h4>
                <p className="text-sm text-muted-foreground">
                  In cases where items are returned in used or damaged condition, a partial refund may be issued at our discretion.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-12 bg-muted rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-3">Need Help With Your Return?</h3>
        <p className="text-muted-foreground mb-6">
          Our customer service team is here to assist you with any questions about returns or exchanges.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="tel:+977-9865-4321">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Call Us
            </Button>
          </a>
          <a href="mailto:info@sanaminternational.com">
            <Button size="lg" className="w-full sm:w-auto">
              Email Us
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
