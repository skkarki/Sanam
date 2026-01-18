'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, MapPin, Send, AlertCircle } from 'lucide-react'

export default function CareersPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    linkedIn: '',
    portfolio: '',
    coverLetter: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Application submitted! Thank you for your interest in joining Sanam International.')
  }

  const jobOpenings = [
    {
      id: 1,
      title: 'Customer Service Representative',
      department: 'Customer Experience',
      location: 'Kathmandu',
      type: 'Full-time',
      salary: 'Rs. 45,000 - 65,000/month',
      description: 'Handle customer inquiries, process returns, and provide exceptional service to our growing customer base.',
      requirements: ['Excellent communication skills', '1+ years customer service experience', 'Fluent in English and Nepali', 'Problem-solving attitude'],
    },
    {
      id: 2,
      title: 'Sales Associate',
      department: 'Retail',
      location: 'Bhaktapur',
      type: 'Full-time',
      salary: 'Rs. 50,000 - 70,000/month + commission',
      description: 'Drive sales by assisting customers, maintaining product displays, and creating memorable shopping experiences.',
      requirements: ['Previous retail experience', 'Outgoing personality', 'Goal-oriented mindset', 'Ability to work weekends'],
    },
    {
      id: 3,
      title: 'Visual Merchandiser',
      department: 'Marketing',
      location: 'Pokhara',
      type: 'Full-time',
      salary: 'Rs. 60,000 - 85,000/month',
      description: 'Create visually appealing product displays, arrange store layouts, and support marketing campaigns and seasonal launches.',
      requirements: ['2+ years visual merchandising experience', 'Creative eye for trends', 'Strong organizational skills', 'Ability to work with marketing team'],
    },
    {
      id: 4,
      title: 'Marketing Coordinator',
      department: 'Marketing',
      location: 'Kathmandu',
      type: 'Full-time',
      salary: 'Rs. 70,000 - 100,000/month',
      description: 'Coordinate marketing campaigns, manage social media presence, and help grow brand awareness for Sanam International across Nepal.',
      requirements: ['3+ years marketing experience', 'Social media management skills', 'Strong written and verbal communication', 'Experience with fashion brands'],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Careers at Sanam International</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Join our team and help shape the future of fashion in Nepal
        </p>
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="h-1 w-20 bg-primary"></div>
          <span className="text-muted-foreground">Open Positions: {jobOpenings.length}</span>
          <div className="h-1 w-20 bg-primary"></div>
        </div>
      </div>

      {/* Company Culture */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Why Work With Us?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Competitive Salary & Benefits</h3>
                  <p className="text-sm text-muted-foreground">
                    We offer industry-leading salaries, performance bonuses, and comprehensive benefits including health insurance, paid time off, and employee discounts.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Career Growth Opportunities</h3>
                  <p className="text-sm text-muted-foreground">
                    We're growing fast! Promote from within, provide training programs, and support professional development with clear advancement paths.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Work with Passionate People</h3>
                  <p className="text-sm text-muted-foreground">
                    Join a diverse, talented team of fashion enthusiasts who love what they do and bring creativity to work every day.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Modern, Dynamic Work Environment</h3>
                  <p className="text-sm text-muted-foreground">
                    Work in our modern Kathmandu headquarters with latest technology, collaborative spaces, and a focus on work-life balance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Benefits & Perks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold text-sm">Competitive Salary</h3>
              <p className="text-xs text-muted-foreground">Market-leading pay</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏥️</span>
              </div>
              <h3 className="font-semibold text-sm">Health Insurance</h3>
              <p className="text-xs text-muted-foreground">Full coverage</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏖️</span>
              </div>
              <h3 className="font-semibold text-sm">Paid Time Off</h3>
              <p className="text-xs text-muted-foreground">Generous leave</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">👕</span>
              </div>
              <h3 className="font-semibold text-sm">50% Employee Discount</h3>
              <p className="text-xs text-muted-foreground">On all products</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="font-semibold text-sm">Learning & Training</h3>
              <p className="text-xs text-muted-foreground">Continuous growth</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎉</span>
              </div>
              <h3 className="font-semibold text-sm">Team Outings</h3>
              <p className="text-xs text-muted-foreground">Regular events</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="font-semibold text-sm">Recognition Awards</h3>
              <p className="text-xs text-muted-foreground">Celebrate success</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Openings */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-6">Open Positions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobOpenings.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                    <Badge variant="outline" className="ml-2">{job.type}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">{job.location}</p>
                    <p className="text-lg font-semibold text-primary">{job.salary}</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{job.description}</p>
                <div className="border-t pt-4">
                  <p className="font-semibold mb-3">Requirements:</p>
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5"></div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button onClick={handleSubmit} className="w-full" size="lg">
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Application Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Join Our Team</CardTitle>
          <CardDescription>
            Ready to take the next step in your career? Submit your application below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name *
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number *
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+977-XXXXXXXXX"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="position" className="text-sm font-medium">
                  Position Applying For *
                </label>
                <select
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full h-10 px-3 border rounded-md bg-background"
                  required
                >
                  <option value="">Select a position...</option>
                  {jobOpenings.map((job) => (
                    <option key={job.id} value={job.title}>{job.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="experience" className="text-sm font-medium">
                Years of Experience
              </label>
              <Input
                id="experience"
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="e.g., 3"
                min="0"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="linkedIn" className="text-sm font-medium">
                  LinkedIn Profile
                </label>
                <Input
                  id="linkedIn"
                  value={formData.linkedIn}
                  onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="portfolio" className="text-sm font-medium">
                  Portfolio / Work Samples
                </label>
                <Input
                  id="portfolio"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="cover-letter" className="text-sm font-medium">
                Cover Letter (Optional)
              </label>
              <Textarea
                id="cover-letter"
                value={formData.coverLetter}
                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                placeholder="Tell us why you'd be a great fit..."
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              <Send className="mr-2 h-5 w-5" />
              Submit Application
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Still Have Questions?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Contact Our HR Team
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Have questions about the application process or want to learn more about working at Sanam International?
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-sm">
                    <span className="font-medium">Email:</span> hr@sanaminternational.com
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-sm">
                    <span className="font-medium">Phone:</span> +977-9865-4321
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-sm">
                    <span className="font-medium">Office:</span> Bode, Madhyapur Thimi - 5, Bhaktapur, Nepal
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                HR team available Sun-Fri: 10AM-6PM, Sat: 10AM-3PM
              </p>
            </div>
            <div className="flex-1 text-center md:text-right">
              <div className="mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">🤝</span>
                </div>
                <h3 className="font-semibold mb-2">Join Our Family</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Be part of Nepal's leading fashion retailer and build your career in a dynamic, growing environment.
                </p>
                <Button size="lg" className="w-full md:w-auto">
                  View All Positions
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
