import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Award, Users, TrendingUp, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

const milestones = [
  {
    year: '2010',
    title: 'Sanam International Founded',
    description: 'Started as a small boutique in Madhyapur Thimi, Bhaktapur with a vision to bring quality fashion to Nepal.',
  },
  {
    year: '2015',
    title: 'First Store Opening',
    description: 'Opened our first flagship store in Bhaktapur with expanded product offerings.',
  },
  {
    year: '2018',
    title: 'Launched Online Store',
    description: 'Expanded to e-commerce with online store reaching customers across Nepal.',
  },
  {
    year: '2022',
    title: 'Reached 100,000+ Customers',
    description: 'Celebrated serving over 100,000 satisfied customers across the country.',
  },
]

const values = [
  {
    icon: <Award className="h-6 w-6 text-primary" />,
    title: 'Quality First',
    description: 'We never compromise on quality. Every product is carefully selected and inspected before reaching our customers.',
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: 'Customer Focused',
    description: 'Our customers are at the heart of everything we do. We strive to provide exceptional service and products.',
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-primary" />,
    title: 'Fashion Forward',
    description: 'We stay ahead of the latest fashion trends while maintaining timeless style and affordability.',
  },
  {
    icon: <Heart className="h-6 w-6 text-primary" />,
    title: 'Sustainability Committed',
    description: 'We\'re committed to sustainable and ethical fashion practices throughout our supply chain.',
  },
]

const team = [
  {
    name: 'Sanam Shrestha',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1560250097-0b076012b892d?w=200&h=200&fit=crop',
    bio: 'With over 15 years of experience in the fashion industry, Sanam founded Sanam International with a vision to bring premium fashion to every Nepali.',
  },
  {
    name: 'Rina Karki',
    role: 'Creative Director',
    image: 'https://images.unsplash.com/photo-15734963596-5e434f4551e?w=200&h=200&fit=crop',
    bio: 'Rina leads our creative team, ensuring every collection tells a unique story while maintaining our commitment to quality and style.',
  },
  {
    name: 'Bibek Thapa',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1519085360-c2d6fb4f4f89?w=200&h=200&fit=crop',
    bio: 'Bibek oversees our day-to-day operations, ensuring smooth store operations and excellent customer service across all locations.',
  },
  {
    name: 'Sunita Sharma',
    role: 'Head of Marketing',
    image: 'https://images.unsplash.com/photo-158048994476-20a8503c04c5?w=200&h=200&fit=crop',
    bio: 'Sunita leads our marketing efforts, connecting Sanam International with fashion enthusiasts across Nepal through various channels.',
  },
]

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Story</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Bringing quality fashion to Nepal since 2010
        </p>
      </div>

      {/* Mission */}
      <div className="mb-16">
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed">
              At Sanam International, our mission is simple: <span className="font-semibold text-primary">to provide high-quality, affordable fashion to every Nepali</span>. We believe that great style shouldn\'t come with a high price tag, and that everyone deserves access to the latest fashion trends.
            </p>
            <p className="text-muted-foreground mt-6">
              Founded in 2010 in the historic city of Madhyapur Thimi, Bhaktapur, we started as a small boutique with a big dream. Today, we\'re proud to serve customers across Nepal through our stores and online platform, offering the perfect blend of quality, style, and affordability.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Milestones */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((milestone, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">{milestone.year}</div>
              <h3 className="text-lg font-semibold mb-2">{milestone.title}</h3>
              <p className="text-sm text-muted-foreground">{milestone.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4 text-primary">
                  {value.icon}
                </div>
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Leadership Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full bg-muted">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground line-clamp-3">{member.bio}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="text-4xl font-bold text-primary mb-2">100K+</div>
            <p className="text-sm text-muted-foreground">Happy Customers</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="text-4xl font-bold text-primary mb-2">50+</div>
            <p className="text-sm text-muted-foreground">Brands</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="text-4xl font-bold text-primary mb-2">5,000+</div>
            <p className="text-sm text-muted-foreground">Products</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="text-4xl font-bold text-primary mb-2">14</div>
            <p className="text-sm text-muted-foreground">Years in Business</p>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <div className="bg-primary rounded-xl p-12 text-center text-primary-foreground">
        <h2 className="text-3xl font-bold mb-4">Join the Sanam International Family</h2>
        <p className="text-xl mb-6 opacity-90">
          Be part of our story. Explore our collections and discover your perfect style.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary">
            Shop Our Collection
          </Button>
          <Button size="lg">
            Join Our Newsletter
          </Button>
        </div>
      </div>
    </div>
  )
}
