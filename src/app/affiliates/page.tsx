import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Percent, Users, TrendingUp, Shield, CheckCircle, Award, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const benefits = [
  {
    icon: <Percent className="h-6 w-6 text-primary" />,
    title: 'Competitive Commission',
    description: 'Earn up to 15% commission on every sale you refer to Sanam International. The more you sell, the more you earn.',
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: 'Trusted Brand',
    description: 'Join our family of over 5,000 registered affilates who promote Sanam International products across Nepal.',
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-primary" />,
    title: 'Marketing Support',
    description: 'Get access to professional banners, product images, and marketing materials to help you promote effectively.',
  },
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: 'Performance Tracking',
    description: 'Real-time dashboard to track clicks, sales, and commissions. Detailed analytics and reporting tools available.',
  },
  {
    icon: <Shield className="h-6 w-6 text-primary" />,
    title: 'Early Payouts',
    description: 'Monthly payouts on 15th of every month. No minimum payout threshold. Multiple payment options available.',
  },
  {
    icon: <Award className="h-6 w-6 text-primary" />,
    title: 'Dedicated Support',
    description: '24/7 affilate manager support to help you with any questions or issues. Personal assistance when you need it.',
  },
]

const steps = [
  {
    number: '1',
    title: 'Sign Up',
    description: 'Complete our simple application form. Approval typically takes 1-2 business days.',
  },
  {
    number: '2',
    title: 'Get Your Links',
    description: 'Once approved, access your unique referral links and marketing materials from your dashboard.',
  },
  {
    number: '3',
    title: 'Start Promoting',
    description: 'Share your links on your website, social media, or with friends and family. Use our banners and images for best results.',
  },
  {
    number: '4',
    title: 'Track & Earn',
    description: 'Monitor your performance in real-time. Commissions are calculated and credited to your account automatically.',
  },
]

const faqs = [
  {
    question: 'How much can I earn as an affilate?',
    answer: 'You can earn up to 15% commission on every sale. There\'s no limit to how much you can earn—the more you promote, the more you make.',
  },
  {
    question: 'How and when do I get paid?',
    answer: 'We pay monthly on the 15th of every month. You can choose from bank transfer, eSewa, or mobile banking. Minimum payout is Rs. 1,000.',
  },
  {
    question: 'Do I need a website to join?',
    answer: 'Not necessarily. While having your own website or blog is ideal, you can also promote through social media, word of mouth, or direct recommendations. Our social media sharing tools make it easy.',
  },
  {
    question: 'What marketing materials do you provide?',
    answer: 'We provide a complete marketing kit including: high-quality product images, banner ads in various sizes, promotional banners, text links, and ready-to-use social media posts. All materials are branded and professional.',
  },
  {
    question: 'Is there a cost to join?',
    answer: 'Absolutely not! Joining the Sanam International affilate program is free. No hidden fees, no charges. You only pay for your own marketing expenses.',
  },
  {
    question: 'How long are my cookies valid?',
    answer: 'Affilate cookies are valid for 30 days from the date of the last click. If a customer doesn\'t purchase immediately, you still have time to earn the commission.',
  },
  {
    question: 'Can I affilate with multiple accounts?',
    answer: 'Each person or entity can have only one affilate account. Multiple accounts for the same person or entity are not permitted. All accounts are verified.',
  },
]

export default function AffiliatesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Become an Affilate</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Earn money by promoting Sanam International products. Join thousands of successful affilates across Nepal.
        </p>
      </div>

      {/* Benefits */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Join Our Program?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4 text-primary">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto">
                  {step.number}
                </div>
                {index < 3 && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-8 bg-primary"></div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Commission Structure */}
      <div className="mb-16 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Commission Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">Up to 15%</div>
              <p className="text-muted-foreground">Commission on Sales</p>
              <p className="text-sm mt-2">Tiered commission structure based on monthly sales volume</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">30 Days</div>
              <p className="text-muted-foreground">Cookie Duration</p>
              <p className="text-sm mt-2">Affilate cookies are valid for 30 days from last click</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">Rs. 1,000</div>
              <p className="text-muted-foreground">Minimum Payout</p>
              <p className="text-sm mt-2">Commissions are paid monthly on 15th day</p>
            </div>
          </div>
        </div>
      </div>

      {/* Who Should Join */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Perfect For</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Fashion Bloggers</h3>
              <p className="text-sm text-muted-foreground">Share your style and earn from your audience</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Social Media Influencers</h3>
              <p className="text-sm text-muted-foreground">Monetize your following with quality fashion</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Website Owners</h3>
              <p className="text-sm text-muted-foreground">Add extra revenue stream to your site</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Fashion Enthusiasts</h3>
              <p className="text-sm text-muted-foreground">Recommend products you love and trust</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Requirements */}
      <div className="mb-16">
        <Card>
          <CardHeader>
            <CardTitle>Affilate Requirements</CardTitle>
            <CardDescription>To ensure the quality of our affilate program</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Minimum Age: 18 years old</p>
                  <p className="text-sm text-muted-foreground">Must be at least 18 years old to join the program</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Valid Payment Account</p>
                  <p className="text-sm text-muted-foreground">Must have a valid bank account, eSewa, or mobile banking for commission payments</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Quality Traffic Source</p>
                  <p className="text-sm text-muted-foreground">Own website, blog, or social media following with genuine engagement (no fake traffic, bots, or purchased clicks)</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Compliance with Terms</p>
                  <p className="text-sm text-muted-foreground">Agreement to affilate terms and conditions, marketing guidelines, and brand usage policies</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Tax Information</p>
                  <p className="text-sm text-muted-foreground">Must provide valid citizenship and tax information as required by Nepal law</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary text-primary-foreground rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
        <p className="text-xl mb-6 opacity-90">
          Join our affilate program today and start earning money by promoting quality fashion from Sanam International.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="secondary" size="lg">
            <Award className="mr-2 h-5 w-5" />
            Review Requirements
          </Button>
          <Button size="lg" className="bg-white text-primary hover:bg-gray-50">
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  )
}
