import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Briefcase, MapPin, Clock, Users, TrendingUp, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const openPositions = [
  {
    id: '1',
    title: 'Customer Service Representative',
    location: 'Bhaktapur Store - On-site',
    type: 'Full-time',
    description: 'Be the face of Sanam International. Help customers find their perfect style and provide exceptional in-store and online service.',
    requirements: 'Excellent communication skills, friendly personality, passion for fashion, 1-2 years of customer service experience preferred.',
  },
  {
    id: '2',
    title: 'Sales Associate',
    location: 'Kathmandu Flagship - On-site',
    type: 'Full-time',
    description: 'Drive sales growth by providing outstanding customer experience and achieving sales targets. Join our dynamic sales team in Kathmandu.',
    requirements: 'Previous retail experience, strong interpersonal skills, ability to work flexible hours, passion for fashion.',
  },
  {
    id: '3',
    title: 'Digital Marketing Specialist',
    location: 'Madhyapur Thimi HQ - On-site',
    type: 'Full-time',
    description: 'Lead our digital marketing efforts including social media, email campaigns, and content creation to grow Sanam International brand across Nepal.',
    requirements: '2-3 years of digital marketing experience, strong understanding of social media platforms, excellent writing skills, experience with e-commerce brands.',
  },
  {
    id: '4',
    title: 'Visual Merchandiser',
    location: 'Bhaktapur Store - On-site',
    type: 'Full-time',
    description: 'Create beautiful and inspiring in-store displays that showcase our products and enhance customer shopping experience.',
    requirements: '1-2 years of visual merchandising or retail display experience, creative eye for detail, ability to work with various materials.',
  },
]

const cultureBenefits = [
  {
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    title: 'Competitive Salary',
    description: 'Industry-competitive compensation packages with performance bonuses.',
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    title: 'Career Growth',
    description: 'Opportunities for advancement into management roles across our stores.',
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    title: 'Learning & Development',
    description: 'Regular training programs and skill-building workshops.',
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    title: 'Employee Discount',
    description: '50% discount on all Sanam International products for team members.',
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    title: 'Work-Life Balance',
    description: 'Flexible scheduling and supportive team environment.',
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    title: 'Health & Wellness',
    description: 'Health insurance coverage and wellness programs.',
  },
]

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Careers</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Join the Sanam International team and help us bring quality fashion to every corner of Nepal
        </p>
      </div>

      {/* Why Work With Us */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Work With Sanam International?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cultureBenefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4 text-primary">
                {benefit.icon}
              </div>
              <h3 className="font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Open Positions */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Open Positions</h2>
          <a href="/contact" className="text-primary hover:underline">
            Can't find what you're looking for? Contact us
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {openPositions.map((position) => (
            <Card key={position.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold">{position.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {position.location}
                    </div>
                  </div>
                  <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                    {position.type}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{position.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Posted 1 week ago</span>
                  </div>
                  <a href="/contact" className="text-primary hover:underline">
                    Apply Now
                  </a>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Requirements:</p>
                  <p className="text-sm text-muted-foreground">{position.requirements}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Culture */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Culture</h2>
        <Card>
          <CardContent className="p-8">
            <p className="text-lg leading-relaxed text-center mb-6">
              At Sanam International, we believe that our people are our greatest asset. We foster a culture of <span className="font-bold text-primary">innovation, collaboration, and inclusivity</span> where every team member\'s voice is heard and creativity is celebrated.
            </p>
            <p className="text-center text-muted-foreground">
              We're more than just a fashion retailer—we're a family working together to make a positive impact on our customers and communities across Nepal.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Application Process */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Application Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">1</div>
            <h3 className="font-semibold mb-2">Submit Application</h3>
            <p className="text-sm text-muted-foreground">
              Send your CV and cover letter to <a href="mailto:careers@sanaminternational.com" className="text-primary hover:underline">careers@sanaminternational.com</a>
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">2</div>
            <h3 className="font-semibold mb-2">Initial Screen</h3>
            <p className="text-sm text-muted-foreground">
              Our HR team will review your application and reach out within 1 week for qualified candidates.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">3</div>
            <h3 className="font-semibold mb-2">Interview</h3>
            <p className="text-sm text-muted-foreground">
              Selected candidates will be invited for interviews (in-person or virtual) with our hiring managers.
            </p>
          </div>
        </div>
      </div>

      {/* Perks */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Employee Perks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-muted p-6 rounded-lg text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold">Team Outings</h3>
            <p className="text-sm text-muted-foreground">
              Quarterly team-building activities and social events
            </p>
          </div>
          <div className="bg-muted p-6 rounded-lg text-center">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold">Training Programs</h3>
            <p className="text-sm text-muted-foreground">
              Ongoing skill development and industry workshops
            </p>
          </div>
          <div className="bg-muted p-6 rounded-lg text-center">
            <Briefcase className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold">Mentorship</h3>
            <p className="text-sm text-muted-foreground">
              One-on-one guidance from experienced team members
            </p>
          </div>
          <div className="bg-muted p-6 rounded-lg text-center">
            <CheckCircle className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold">Recognition & Rewards</h3>
            <p className="text-sm text-muted-foreground">
              Employee of the month and annual performance bonuses
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary text-primary-foreground rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey With Us?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join our team and help shape the future of fashion in Nepal
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary">
            View All Positions
          </Button>
          <Button size="lg">
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  )
}
