import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Newspaper, Calendar, ExternalLink, Download, Instagram, Facebook, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'

const pressReleases = [
  {
    id: '1',
    date: 'March 15, 2025',
    title: 'Sanam International Announces Summer Collection 2025',
    category: 'Company News',
    description: 'Launching our most anticipated summer collection featuring sustainable materials and contemporary designs. The collection includes over 200 items across men\'s, women\'s, and kids\' categories.',
    image: 'https://images.unsplash.com/photo-1490484445684-5cb537d6698?w=800&h=600&fit=crop',
  },
  {
    id: '2',
    date: 'February 28, 2025',
    title: 'Sanam International Opens New Flagship Store in Pokhara',
    category: 'Expansion',
    description: 'Our new flagship store in Pokhara brings quality fashion to Nepal\'s second-largest city. The 15,000 sq ft store features our complete collection and dedicated customer service center.',
    image: 'https://images.unsplash.com/photo-1441986300929-e22b227a681?w=800&h=600&fit=crop',
  },
  {
    id: '3',
    date: 'January 20, 2025',
    title: 'Sanam International Partners with Top Brands for Exclusive Collection',
    category: 'Partnerships',
    description: 'Announced strategic partnerships with Nike, Adidas, Puma, and New Balance to bring exclusive collections to Sanam International stores across Nepal.',
    image: 'https://images.unsplash.com/photo-1441986300929-e22b227a681?w=800&h=600&fit=crop',
  },
  {
    id: '4',
    date: 'December 15, 2024',
    title: 'Sanam International Reaches 100,000 Customers Milestone',
    category: 'Achievement',
    description: 'Celebrating 100,000 satisfied customers across Nepal. This milestone represents our commitment to quality, affordability, and exceptional customer service.',
    image: 'https://images.unsplash.com/photo-1441986300929-e22b227a681?w=800&h=600&fit=crop',
  },
]

export default function PressPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Press Room</h1>
        <p className="text-xl text-muted-foreground">
          Latest news, press releases, and media resources about Sanam International
        </p>
      </div>

      {/* Press Releases */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Press Releases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pressReleases.map((release) => (
            <Card key={release.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={release.image}
                      alt={release.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                        {release.category}
                      </span>
                      <span className="text-sm text-muted-foreground">{release.date}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{release.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{release.description}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download Press Kit
                  </Button>
                  <Button size="sm" className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Read Full Story
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Media Assets */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Media Assets</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Logos</CardTitle>
              <CardDescription>High-resolution logos in various formats</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted">
                  <span className="font-medium">Primary Logo (PNG)</span>
                  <Button variant="outline" size="sm">Download</Button>
                </li>
                <li className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted">
                  <span className="font-medium">Primary Logo (SVG)</span>
                  <Button variant="outline" size="sm">Download</Button>
                </li>
                <li className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted">
                  <span className="font-medium">Secondary Logo (PNG)</span>
                  <Button variant="outline" size="sm">Download</Button>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Lifestyle and product shots</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted">
                  <span className="font-medium">Summer Collection 2025</span>
                  <Button variant="outline" size="sm">Download</Button>
                </li>
                <li className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted">
                  <span className="font-medium">Flagship Store Opening</span>
                  <Button variant="outline" size="sm">Download</Button>
                </li>
                <li className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted">
                  <span className="font-medium">Brand Photography</span>
                  <Button variant="outline" size="sm">Download</Button>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Brand Guidelines</CardTitle>
              <CardDescription>Logo usage and brand book</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted">
                  <span className="font-medium">Brand Book (PDF)</span>
                  <Button variant="outline" size="sm">Download</Button>
                </li>
                <li className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted">
                  <span className="font-medium">Logo Usage Guidelines</span>
                  <Button variant="outline" size="sm">Download</Button>
                </li>
                <li className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted">
                  <span className="font-medium">Color Palette</span>
                  <Button variant="outline" size="sm">Download</Button>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Press Contacts */}
      <div className="mb-16">
        <Card>
          <CardHeader>
            <CardTitle>Media Inquiries</CardTitle>
            <CardDescription>
              For press interviews, partnerships, and media opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Press Contact</h3>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Name:</span> Sanam Shrestha (PR Manager)
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Email:</span> press@sanaminternational.com
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Phone:</span> +977-9865-4321
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Business Inquiries</h3>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Name:</span> Sanam Shrestha
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Title:</span> Founder & CEO
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Email:</span> ceo@sanaminternational.com
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Social Media */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Follow Our Story</h2>
        <div className="flex justify-center gap-6">
          <a href="#" className="p-4 border rounded-lg hover:bg-muted transition-colors">
            <Instagram className="h-8 w-8 text-primary" />
          </a>
          <a href="#" className="p-4 border rounded-lg hover:bg-muted transition-colors">
            <Facebook className="h-8 w-8 text-primary" />
          </a>
          <a href="#" className="p-4 border rounded-lg hover:bg-muted transition-colors">
            <Twitter className="h-8 w-8 text-primary" />
          </a>
          <a href="#" className="p-4 border rounded-lg hover:bg-muted transition-colors">
            <ExternalLink className="h-8 w-8 text-primary" />
          </a>
        </div>
      </div>

      {/* Events */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Upcoming Events</h2>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Summer Collection Launch Party</CardTitle>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">March 20, 2025</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Join us for the launch of our Summer 2025 Collection. RSVP required for entry.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Location:</p>
                  <p className="font-medium">Sanam International Flagship Store, Bode, Madhyapur Thimi - 5, Bhaktapur</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time:</p>
                  <p className="font-medium">5:00 PM - 8:00 PM</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Guests:</p>
                  <p className="font-medium">Fashion influencers, celebrities, and media</p>
                </div>
              </div>
              <Button className="w-full mt-4">RSVP Now</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-muted rounded-2xl p-12 text-center">
        <h3 className="text-2xl font-bold mb-3">Need More Information?</h3>
        <p className="text-muted-foreground mb-6">
          Download our complete media kit or contact our PR team for detailed inquiries.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" size="lg">
            <Newspaper className="h-5 w-5 mr-2" />
            Download Media Kit
          </Button>
          <a href="/contact">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <ExternalLink className="h-5 w-5 mr-2" />
              Contact PR Team
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
