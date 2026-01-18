'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const faqs = [
  {
    id: '1',
    category: 'Orders & Payments',
    question: 'How long does delivery take?',
    answer: 'Standard delivery takes 3-5 business days within Kathmandu Valley and 5-7 business days for other areas in Nepal. Express delivery arrives in 1-2 business days for major cities.',
    isOpen: false,
  },
  {
    id: '2',
    category: 'Orders & Payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major payment methods including cash on delivery, bank transfer, eSewa, Khalti, mobile banking, and all major credit/debit cards (Visa, MasterCard, American Express). Online payments are processed securely.',
    isOpen: false,
  },
  {
    id: '3',
    category: 'Orders & Payments',
    question: 'Is my payment information secure?',
    answer: 'Yes, absolutely. We use industry-standard SSL encryption to protect your payment information. All transactions are processed securely through trusted payment gateways.',
    isOpen: false,
  },
  {
    id: '4',
    category: 'Returns & Exchanges',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy on all unworn and unwashed items in their original condition. Exchanges are free of charge. Return shipping fee of Rs. 200 applies to all returns.',
    isOpen: false,
  },
  {
    id: '5',
    category: 'Returns & Exchanges',
    question: 'How do I initiate a return or exchange?',
    answer: 'Log in to your account and go to "My Orders" to find the item you want to return or exchange. Click on "Return Item" or "Exchange Item" button to start the process. You\'ll receive a return authorization number (RAN) via email.',
    isOpen: false,
  },
  {
    id: '6',
    category: 'Returns & Exchanges',
    question: 'Can I return an item that was on sale?',
    answer: 'Yes, all items including sale items can be returned within our 30-day return window, provided they meet our return conditions (unworn, unwashed, original tags attached). Final sale items (discounts above 70%) are non-returnable.',
    isOpen: false,
  },
  {
    id: '7',
    category: 'Returns & Exchanges',
    question: 'How long does it take to receive a refund?',
    answer: 'Once we receive and inspect your return, refunds are processed within 5-7 business days. The time it takes for the amount to appear in your account depends on your payment method (1-2 business days for bank transfers, 3-5 business days for card refunds).',
    isOpen: false,
  },
  {
    id: '8',
    category: 'Returns & Exchanges',
    question: 'Do you offer exchanges for different sizes?',
    answer: 'Yes! We offer free exchanges on all items within 30 days of delivery. Simply select your preferred size or color when initiating the exchange, and we\'ll ship your new item immediately upon receiving your return.',
    isOpen: false,
  },
  {
    id: '9',
    category: 'Product Information',
    question: 'How do I know if an item is in stock?',
    answer: 'Product availability is shown on each product page. If an item is out of stock, you can select "Notify Me" to receive an email when it becomes available again. You can also check back regularly as restocked items are shown as "Available Soon."',
    isOpen: false,
  },
  {
    id: '10',
    category: 'Product Information',
    question: 'Are your products authentic and genuine?',
    answer: 'Yes, absolutely. Sanam International is an authorized retailer for all the brands we carry. Every product is 100% authentic and comes with full manufacturer warranty. We source directly from brands or authorized distributors.',
    isOpen: false,
  },
  {
    id: '11',
    category: 'Product Information',
    question: 'What sizes do you carry?',
    answer: 'We carry a wide range of sizes including Asian sizes (Nepal/India fit), European sizes, and US sizes depending on the brand. Check our detailed Size Guide page for specific measurements. For clothing, we typically carry sizes XXS to XXL. For shoes, we carry sizes from 5 to 12 in both men\'s and women\'s ranges, plus kids\' sizes.',
    isOpen: false,
  },
  {
    id: '12',
    category: 'Product Information',
    question: 'Do you offer gift wrapping?',
    answer: 'Yes, we offer gift wrapping for orders above Rs. 5,000. During checkout, select the "Gift Wrap" option for a nominal fee of Rs. 200. Premium gift wrapping with branded boxes and cards is available for orders above Rs. 10,000.',
    isOpen: false,
  },
  {
    id: '13',
    category: 'Account & Security',
    question: 'How do I create an account?',
    answer: 'Click on "Sign Up" or "Register" in the top right corner of our website. You can also sign up during checkout. You\'ll need to provide your name, email address, and create a password. A verification email will be sent to confirm your account.',
    isOpen: false,
  },
  {
    id: '14',
    category: 'Account & Security',
    question: 'I forgot my password. What should I do?',
    answer: 'Click on "Forgot Password" link on the login page. Enter your registered email address and we\'ll send you a password reset link. The link will be valid for 24 hours. Check your spam folder if you don\'t receive the email within a few minutes.',
    isOpen: false,
  },
  {
    id: '15',
    category: 'Account & Security',
    question: 'How do I update my personal information?',
    answer: 'Log in to your account and go to "My Profile" or "Account Settings". Here you can update your name, email, phone number, and shipping addresses. Changes are saved immediately and will apply to future orders.',
    isOpen: false,
  },
  {
    id: '16',
    category: 'Account & Security',
    question: 'Is my personal information secure?',
    answer: 'Yes, we take data security very seriously. We use industry-standard encryption, secure servers, and follow data protection best practices. We never store your CVV/CVC number after payment. Your personal information is only accessible through your account with your password.',
    isOpen: false,
  },
  {
    id: '17',
    category: 'Shipping',
    question: 'Do you ship internationally?',
    answer: 'Currently, we only ship within Nepal. We do not offer international shipping. For customers outside Nepal, we apologize for any inconvenience. We plan to expand our shipping to other countries in the future.',
    isOpen: false,
  },
  {
    id: '18',
    category: 'Shipping',
    question: 'Can I track my order?',
    answer: 'Yes, absolutely! Once your order is shipped, you\'ll receive a tracking number via email and SMS. You can track your order on our website by entering your order number (e.g., ORD-20250120-7K3M) in the "Track Order" section or page.',
    isOpen: false,
  },
  {
    id: '19',
    category: 'Shipping',
    question: 'What happens if I\'m not home for delivery?',
    answer: 'Our delivery partner will attempt delivery twice. If unsuccessful after the second attempt, your package will be held at a local pickup point or our store for 3 days. After that, it will be returned to our warehouse. You can contact customer service to arrange redelivery.',
    isOpen: false,
  },
  {
    id: '20',
    category: 'General',
    question: 'How can I contact customer service?',
    answer: 'You can reach our customer service team in several ways:\n\n• Phone: +977-9865-4321 (10 AM - 8 PM, 7 days a week)\n• Email: info@sanaminternational.com (We respond within 24-48 hours)\n• Live Chat: Available on our website during business hours\n• Visit our store: Bode, Madhyapur Thimi - 5, Bhaktapur, Nepal\n\nFor fastest response, please include your order number in all communications.',
    isOpen: false,
  },
]

export default function FAQPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCategory, setFilteredCategory] = useState<string>('All')

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id)
  }

  const categories = ['All', 'Orders & Payments', 'Returns & Exchanges', 'Product Information', 'Account & Security', 'Shipping', 'General']

  const filteredFaqs = searchTerm
    ? faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredCategory === 'All'
      ? faqs
      : faqs.filter(faq => faq.category === filteredCategory)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground">
          Find answers to common questions about Sanam International
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full max-w-2xl"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                setFilteredCategory(category)
                setSearchTerm('')
              }}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all
                ${filteredCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFaqs.map((faq) => (
          <Card key={faq.id}>
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleFaq(faq.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base font-normal">
                    <span className="text-muted-foreground mr-2 text-sm">{faq.category}</span>
                    {faq.question}
                  </CardTitle>
                </div>
                <div>
                  {openFaq === faq.id ? (
                    <ChevronUp className="h-5 w-5 text-primary" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-primary" />
                  )}
                </div>
              </div>
            </CardHeader>
            {openFaq === faq.id && (
              <CardContent>
                <CardDescription className="text-base leading-relaxed whitespace-pre-line">
                  {faq.answer}
                </CardDescription>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Still Need Help? */}
      {filteredFaqs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            No FAQs found matching your search.
          </p>
          <Button
            onClick={() => {
              setSearchTerm('')
              setFilteredCategory('All')
            }}
            variant="outline"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-12 bg-muted rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-3">Can't Find What You're Looking For?</h3>
        <p className="text-muted-foreground mb-6">
          Our customer service team is ready to help you with any questions or concerns.
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
          <a href="/contact">
            <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
              Contact Form
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
