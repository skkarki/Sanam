# Sanam International E-commerce Platform

## Project Overview

Sanam International is a comprehensive e-commerce platform built with modern web technologies. It serves as a complete online retail solution with both customer-facing and admin dashboard functionalities.

### Key Features:
- **Customer Portal**: Shopping cart, product browsing, checkout, user profiles
- **Admin Dashboard**: Product management, order tracking, customer management, analytics
- **Payment Integration**: Khalti and eSewa payment gateways
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI/UX**: Built with shadcn/ui components

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (React-based framework)
- **Styling**: Tailwind CSS for utility-first styling
- **UI Components**: shadcn/ui for accessible components
- **Icons**: Lucide React for consistent iconography
- **Animations**: Framer Motion for smooth transitions
- **State Management**: Zustand for cart and application state

### Backend
- **Runtime**: Node.js with Bun as JavaScript runtime
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom session-based authentication
- **API**: Next.js App Router with Server Actions
- **Image Handling**: Local file storage system

### Infrastructure
- **Development**: TypeScript for type safety
- **Database**: PostgreSQL with Prisma for ORM
- **Deployment**: Docker containerization ready
- **Web Server**: Caddy for reverse proxy

### Architecture Patterns
- **Component-Based**: Reusable React components
- **API-First**: RESTful API design with Next.js API Routes
- **Microservices Ready**: Modular architecture design
- **Server-Side Rendering**: Optimized performance with SSR

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API Routes
│   │   ├── auth/       # Authentication APIs
│   │   ├── admin/      # Admin APIs
│   │   ├── products/   # Product APIs
│   │   └── checkout/   # Payment & Checkout APIs
│   ├── admin/          # Admin Dashboard
│   ├── auth/           # Authentication Pages
│   ├── products/       # Product Pages
│   ├── cart/           # Shopping Cart
│   └── checkout/       # Checkout Process
├── components/         # Reusable UI Components
├── data/              # Static Data and Types
├── hooks/             # Custom React Hooks
└── lib/               # Utility Functions and Libraries
```

## Core Functionalities

### 1. User Management
- Registration and Login
- Password Reset (Forgot Password)
- Session Management
- User Profiles

### 2. Product Management
- Product Catalog with Categories
- Product Variants (Color, Size)
- Inventory Tracking
- Product Images and Galleries

### 3. Shopping Experience
- Shopping Cart (Persistent)
- Product Search and Filtering
- Category Browsing
- Product Reviews (Coming Soon)

### 4. Checkout Process
- Multi-step Checkout
- Address Management
- Multiple Payment Methods
- Order Confirmation

### 5. Admin Dashboard
- Product Management
- Order Management
- Customer Management
- Sales Analytics
- Category Management

### 6. Payment Integration
- **Khalti Payment Gateway** (Live + Test)
- **eSewa Payment Gateway** (Live + Test)
- **Cash on Delivery** Option
- Order Status Tracking

## Viva Questions and Answers

### Q1: Why did you choose Next.js for this project?

**Answer:** Next.js was chosen for several reasons:
- **Server-Side Rendering (SSR)**: Better SEO and initial load performance
- **Static Site Generation (SSG)**: Pre-built pages for faster loading
- **API Routes**: Built-in serverless API endpoints
- **File-based Routing**: Intuitive and automatic routing system
- **Hybrid Approach**: Flexibility to use both static and dynamic rendering
- **Performance**: Automatic code splitting and optimization
- **Developer Experience**: Fast refresh and excellent TypeScript support

### Q2: How does the authentication system work?

**Answer:** The authentication system uses:
- **Session-based Authentication**: JWT tokens stored in HTTP-only cookies
- **Server Actions**: Secure authentication logic on the server
- **Middleware Protection**: Route guards for protected pages
- **Password Hashing**: SHA-256 hashing for secure password storage
- **Role-based Access**: Different permissions for admin and customer users

### Q3: Explain the database design and relationships.

**Answer:** The database uses Prisma ORM with PostgreSQL and includes:
- **Users Table**: Stores user accounts with roles and authentication data
- **Products Table**: Core product information with relationships
- **Categories Table**: Hierarchical category system
- **Brands Table**: Brand information
- **Product Variants**: Different sizes and colors for products
- **Inventory**: Stock tracking per variant
- **Orders and Order Items**: Complete order management system
- **Relationships**: Properly defined relations with foreign keys

### Q4: How is the payment system integrated?

**Answer:** The payment system includes:
- **Multiple Gateways**: Khalti and eSewa integration
- **Test Environment**: Mock payment system for demonstration
- **Order Tracking**: Complete order lifecycle management
- **Security**: Server-side verification to prevent fraud
- **Fallback System**: Mock payment for development/testing

### Q5: What makes this project scalable?

**Answer:** Scalability features include:
- **Modular Architecture**: Component-based design
- **Database Optimization**: Proper indexing and relations
- **Caching Strategies**: Planned for production
- **CDN Ready**: Image optimization and serving
- **Microservice Architecture**: Ready for service separation
- **Load Balancing**: Infrastructure ready for multiple instances

### Q6: How did you handle security concerns?

**Answer:** Security measures implemented:
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **XSS Prevention**: Proper input sanitization
- **CSRF Protection**: Secure session handling
- **Password Security**: Hashing and secure storage
- **API Protection**: Rate limiting and validation
- **Cookie Security**: HTTP-only and secure flags

### Q7: Explain the state management approach.

**Answer:** State management includes:
- **Client State**: Zustand for cart and UI state
- **Server State**: React Query for API data
- **URL State**: Next.js router for navigation state
- **Form State**: React Hook Form for form handling
- **Global State**: Context API for application-wide state

### Q8: How does the responsive design work?

**Answer:** Responsive design features:
- **Mobile-First Approach**: Tailwind CSS mobile-first classes
- **Breakpoint System**: Proper responsive breakpoints
- **Touch-Friendly**: Large touch targets and gestures
- **Flexible Grids**: CSS Grid and Flexbox layouts
- **Optimized Images**: Responsive image loading

### Q9: What are the performance optimizations?

**Answer:** Performance optimizations include:
- **Code Splitting**: Automatic by Next.js
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Dynamic imports for components
- **Caching**: Browser and server-side caching
- **Minification**: Automatic in production builds
- **Bundle Analysis**: Webpack bundle analyzer

### Q10: How would you improve this project further?

**Answer:** Potential improvements:
- **Advanced Search**: Elasticsearch integration
- **Real-time Updates**: WebSocket connections
- **Advanced Analytics**: Comprehensive dashboard
- **Mobile App**: React Native companion app
- **AI Recommendations**: Personalized product suggestions
- **Advanced Inventory**: Multi-location inventory
- **Subscription Services**: Recurring payments
- **Social Features**: User reviews and ratings

## Deployment Strategy

### Development
- **Hot Reload**: Real-time code changes
- **Type Checking**: TypeScript compilation
- **Linting**: ESLint for code quality

### Production
- **Optimization**: Bundle size optimization
- **Environment Variables**: Secure configuration
- **Database Migration**: Prisma migration system
- **Monitoring**: Error tracking and logging

## Deployment Strategy

### Development
- **Hot Reload**: Real-time code changes
- **Type Checking**: TypeScript compilation
- **Linting**: ESLint for code quality

### Production
- **Optimization**: Bundle size optimization
- **Environment Variables**: Secure configuration
- **Database Migration**: Prisma migration system
- **Monitoring**: Error tracking and logging

## GitHub Repository Setup

To connect this project to a new GitHub repository:

1. **Create a new repository** on GitHub
2. **Initialize git in your local project**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Sanam International e-commerce platform"
   ```
3. **Add your new GitHub repository as remote**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
   ```
4. **Push to GitHub**:
   ```bash
   git branch -M main
   git push -u origin main
   ```
5. **Set up environment variables** by copying `.env.local.example` to `.env.local` and filling in your values

## Conclusion

The Sanam International e-commerce platform demonstrates modern web development practices with a focus on:
- **User Experience**: Intuitive interface and smooth interactions
- **Performance**: Optimized loading and responsiveness
- **Security**: Robust authentication and data protection
- **Scalability**: Architecture ready for growth
- **Maintainability**: Clean code structure and documentation

This project showcases the integration of various technologies to create a complete, production-ready e-commerce solution suitable for the Nepalese market with local payment gateways.