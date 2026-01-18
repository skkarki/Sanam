'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shirt, Ruler } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SizeGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Size Guide</h1>
        <p className="text-xl text-muted-foreground">
          Find your perfect fit with our detailed size charts
        </p>
      </div>

      <Tabs defaultValue="clothing" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="clothing" className="flex items-center gap-2">
            <Shirt className="h-4 w-4" />
            Clothing
          </TabsTrigger>
          <TabsTrigger value="shoes" className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Shoes
          </TabsTrigger>
        </TabsList>

        {/* General Tips */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>General Sizing Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Shirt className="h-5 w-5 text-primary" />
                    Clothing
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Take measurements over lightweight clothing</li>
                    <li>• Stand naturally with good posture</li>
                    <li>• Don't pull tape measure too tight</li>
                    <li>• Measure at least twice for accuracy</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-primary" />
                    Shoes
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Measure at the end of the day when feet are slightly swollen</li>
                    <li>• Wear the type of socks you plan to wear</li>
                    <li>• Leave some room for toe movement (about 0.5cm)</li>
                    <li>• If you're between sizes, we recommend sizing up for comfort</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Size Chart Table */}
        <div className="bg-muted p-6 rounded-xl">
          <h3 className="text-center text-xl font-bold mb-6">Quick Reference Chart</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-center py-3 px-4">XS</th>
                  <th className="text-center py-3 px-4">S</th>
                  <th className="text-center py-3 px-4">M</th>
                  <th className="text-center py-3 px-4">L</th>
                  <th className="text-center py-3 px-4">XL</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Chest (inches)</td>
                  <td className="text-center py-3 px-4">32-36</td>
                  <td className="text-center py-3 px-4">36-38</td>
                  <td className="text-center py-3 px-4">38-40</td>
                  <td className="text-center py-3 px-4">42-44</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Waist (inches)</td>
                  <td className="text-center py-3 px-4">24-26</td>
                  <td className="text-center py-3 px-4">28-30</td>
                  <td className="text-center py-3 px-4">30-32</td>
                  <td className="text-center py-3 px-4">32-34</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Hips (inches)</td>
                  <td className="text-center py-3 px-4">34-36</td>
                  <td className="text-center py-3 px-4">36-38</td>
                  <td className="text-center py-3 px-4">38-40</td>
                  <td className="text-center py-3 px-4">40-42</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Tabs>

      {/* CTA Section */}
      <div className="mt-12 bg-muted rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-3">Still Need Help?</h3>
        <p className="text-muted-foreground mb-6">
          Our customer service team is here to help you find your perfect size. Contact us for personalized assistance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="tel:+977-9865-4321">
            <Button variant="outline">Call Us</Button>
          </a>
          <a href="mailto:info@sanaminternational.com">
            <Button>Email Us</Button>
          </a>
          <a href="/contact">
            <Button>Visit Store</Button>
          </a>
        </div>
      </div>
    </div>
  )
}
