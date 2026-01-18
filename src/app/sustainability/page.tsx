import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Leaf, Recycle, Globe, Heart } from 'lucide-react'

export default function SustainabilityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Sustainability</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Committed to a better future for Nepal and our planet
        </p>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-12 mb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Our Environmental Commitment</h2>
          <p className="text-lg leading-relaxed">
            At Sanam International, we believe that fashion and responsibility go hand in hand. We're committed to reducing our environmental footprint while bringing you the styles you love.
          </p>
        </div>
      </div>

      {/* Sustainability Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-green-600" />
              Eco-Friendly Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              We source sustainable materials whenever possible and continuously work to improve our material choices.
            </CardDescription>
            <ul className="space-y-3 mt-4">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span className="text-muted-foreground">Organic cotton for select clothing lines</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span className="text-muted-foreground">Recycled polyester and blended fabrics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span className="text-muted-foreground">Sustainably sourced leather alternatives</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span className="text-muted-foreground">Reducing single-use plastics in packaging</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span className="text-muted-foreground">Natural dyes where possible</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Recycle className="h-6 w-6 text-blue-600" />
              Circular Economy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              We're transitioning towards a circular fashion model where products have longer life cycles.
            </CardDescription>
            <ul className="space-y-3 mt-4">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-muted-foreground">Clothing recycling program in partnership with local NGOs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-muted-foreground">Quality control to ensure products last longer</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-muted-foreground">Repair and alteration services to extend product life</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-muted-foreground">Second-hand section featuring pre-loved items</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-purple-600" />
              Ethical Supply Chain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              We ensure fair treatment of workers and ethical practices throughout our supply chain.
            </CardDescription>
            <ul className="space-y-3 mt-4">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span className="text-muted-foreground">Fair wages and safe working conditions for all workers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span className="text-muted-foreground">Regular audits of manufacturing facilities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span className="text-muted-foreground">Partnerships with certified suppliers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span className="text-muted-foreground">No child labor or forced labor</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span className="text-muted-foreground">Animal welfare compliance</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Goals & Targets */}
      <div className="bg-muted rounded-2xl p-12 mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Sustainability Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">2030</div>
            <p className="text-sm text-muted-foreground">Net Zero Emissions</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">50%</div>
            <p className="text-sm text-muted-foreground">Recycled Materials</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <p className="text-sm text-muted-foreground">Sustainable Packaging</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">25%</div>
            <p className="text-sm text-muted-foreground">Water Usage Reduction</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <p className="text-sm text-muted-foreground">Fair Trade Certified</p>
          </div>
        </div>
      </div>

      {/* Initiatives */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Current Initiatives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Plastic Free Packaging</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We've eliminated single-use plastics from our packaging, opting for recyclable and biodegradable alternatives.
              </p>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="font-semibold text-green-700">Achieved: 2024</p>
                <p className="text-sm">All packaging is now plastic-free and 100% recyclable.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Solar-Powered Stores</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our flagship stores in Kathmandu and Bhaktapur are powered by solar energy, reducing our carbon footprint.
              </p>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="font-semibold text-yellow-700">In Progress: 2 Stores</p>
                <p className="text-sm">Rolling out to 5 additional stores in 2025.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Textile Recycling</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We've partnered with local textile recycling centers to ensure old clothes don't end up in landfills.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold text-blue-700">Active: Since 2022</p>
                <p className="text-sm">Over 10 tons of textiles recycled to date.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary rounded-2xl p-12 text-center text-primary-foreground">
        <h2 className="text-3xl font-bold mb-4">Together We Can Make a Difference</h2>
        <p className="text-xl mb-8 opacity-90">
          Every purchase supports our sustainability initiatives. Choose brands and products that align with your values.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/products">
            <Button size="lg" variant="secondary">
              Shop Sustainable Collection
            </Button>
          </a>
          <a href="/contact">
            <Button size="lg" variant="outline" className="text-primary border-primary hover:bg-primary/10">
              Learn More About Our Impact
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
