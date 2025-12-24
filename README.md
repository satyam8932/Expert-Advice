# AdviceExpert.io - Video Submission & AI Analysis Platform

## 📋 Table of Contents
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Features](#features)
- [Subscription Plans](#subscription-plans)
- [AI Processing Workflows](#ai-processing-workflows)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Important Notes](#important-notes)

---

## 🎯 Overview

**AdviceExpert.io** is a comprehensive SaaS platform that enables users to collect video submissions through custom forms, automatically transcribe and analyze them using AI, and gain actionable insights. The platform features a robust subscription system, dynamic usage limits, and advanced video intelligence capabilities powered by cutting-edge AI models.

### Key Capabilities
- 📹 **Video Collection Forms**: Create custom forms to collect video submissions from clients/users
- 🤖 **AI Transcription**: Automatic transcription with speaker diarization using AssemblyAI
- 📊 **Smart Summaries**: AI-generated summaries with action points using OpenAI GPT-4
- 🎬 **Video Intelligence**: Deep video analysis and insights using Google Gemini 2.0 Flash-Lite
- 💳 **Subscription Management**: Stripe-powered subscription system with multiple plans
- 📈 **Usage Tracking**: Real-time tracking of storage, transcription minutes, and submissions
- 👨‍💼 **Admin Panel**: Comprehensive admin dashboard for user and subscription management
- 📧 **Contact System**: Public contact form with admin query management

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 16.0.7](https://nextjs.org/) (App Router)
- **React**: 19.2.0
- **UI Components**: 
  - [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
  - [NextUI](https://nextui.org/) - Beautiful React components
  - [Lucide React](https://lucide.dev/) - Icon library
- **Styling**: 
  - [Tailwind CSS 4](https://tailwindcss.com/)
  - [Framer Motion](https://www.framer.com/motion/) - Animations
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) - Lightweight state management
- **Forms & Validation**: React Hook Form, Zod
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes) - Dark/Light mode support
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) - Toast notifications

### Backend
- **Runtime**: Node.js with Next.js API Routes
- **Database**: PostgreSQL (via Supabase)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) 0.44.7
- **Database Migrations**: [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) 0.31.6
- **Authentication**: [Supabase Auth](https://supabase.com/docs/guides/auth)
- **Storage**: [Supabase Storage](https://supabase.com/docs/guides/storage)
- **Payments**: [Stripe](https://stripe.com/) 20.0.0
- **Middleware**: Custom proxy middleware for route protection

### External Services & APIs
- **AssemblyAI**: Audio/video transcription with speaker diarization
  - Account: Eli Isaac, ESI Inc.
  - Features: Transcription, diarization, speaker labels, timestamps
- **OpenAI GPT-4.1 Nano**: Text summarization and action point extraction
  - Currently using N8N free credits (100 API credits)
  - **Future**: Will require paid OpenAI API key
- **Google Cloud Platform**:
  - **Vertex AI**: Gemini 2.0 Flash-Lite for video intelligence
  - **Cloud Storage**: Temporary video processing bucket (`temp-video-processing`)
  - **Pricing**: $0.10 per million tokens (input), $300 free credits + 1000 free minutes
- **N8N Workflows**: Automation platform for webhook handling and AI processing
  - Self-hosted at: `https://eisoftware.app.n8n.cloud`

### Development Tools
- **TypeScript**: 5.x - Type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Date-fns**: Date manipulation
- **React Media Recorder**: Video recording in browser
- **React Phone Number Input**: International phone number input
- **Markdown-to-JSX**: Markdown rendering
- **React JSON View**: JSON visualization
- **React Syntax Highlighter**: Code syntax highlighting

---

## 🏗️ Architecture

### Application Structure

```
box-rental-now/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (protected)/              # Protected routes (require auth)
│   │   │   └── dashboard/
│   │   │       ├── admin/            # Admin panel
│   │   │       ├── billings/         # Subscription management
│   │   │       ├── forms/            # Form management
│   │   │       ├── submissions/      # Submission viewing
│   │   │       ├── settings/         # User settings
│   │   │       └── help/             # Help center
│   │   ├── (public)/                 # Public routes
│   │   │   ├── contact/              # Contact form
│   │   │   └── forms/[id]/           # Public submission form
│   │   ├── auth/                     # Authentication pages
│   │   ├── api/                      # API routes
│   │   │   ├── admin/                # Admin APIs
│   │   │   ├── billing/              # Billing APIs
│   │   │   ├── checkout/             # Stripe checkout
│   │   │   ├── contact/              # Contact form API
│   │   │   ├── forms/                # Form CRUD
│   │   │   ├── submissions/          # Submission CRUD
│   │   │   ├── n8n/                  # N8N webhook callbacks
│   │   │   └── webhooks/stripe/      # Stripe webhooks
│   │   └── page.tsx                  # Landing page
│   ├── components/                   # React components
│   │   ├── (public)/                 # Public components
│   │   ├── admin/                    # Admin components
│   │   ├── auth/                     # Auth components
│   │   ├── billing/                  # Billing components
│   │   ├── dashboard/                # Dashboard components
│   │   ├── forms/                    # Form components
│   │   ├── landing/                  # Landing page components
│   │   ├── submissions/              # Submission components
│   │   └── ui/                       # Reusable UI components
│   ├── lib/                          # Utility libraries
│   │   ├── auth/                     # Auth helpers
│   │   ├── db/                       # Database client
│   │   ├── limits/                   # Limit initialization
│   │   ├── quota/                    # Quota checking
│   │   ├── stripe/                   # Stripe configuration
│   │   ├── types/                    # TypeScript types
│   │   ├── usage/                    # Usage tracking
│   │   └── utils/                    # General utilities
│   ├── store/                        # Zustand stores
│   ├── supabase/                     # Supabase clients
│   └── proxy.ts                      # Route protection middleware
├── drizzle/                          # Database schema & migrations
│   ├── schema.ts                     # Database schema
│   └── migrations/                   # Migration files
├── public/                           # Static assets
└── .env                              # Environment variables
```

### Request Flow

#### 1. User Submission Flow
```
User fills form → Video upload to Supabase Storage → 
Database record created → N8N Transcription Workflow triggered →
AssemblyAI processes video → OpenAI generates summary →
Files saved to Supabase → Database updated → User notified
```

#### 2. Video Intelligence Flow
```
User clicks "Process with AI" → API validates subscription →
N8N Video Intelligence Workflow triggered → Video uploaded to GCS →
Manifest file created → Vertex AI Gemini processes video →
Polling for completion → Insights saved to database →
Usage limits updated → User sees results
```

#### 3. Subscription Flow
```
User selects plan → Stripe Checkout created → Payment processed →
Stripe webhook fired → N8N Webhook Workflow → 
Subscription/Limits/Usage tables updated → User access granted
```

---

## 🗄️ Database Schema

### Tables Overview

The application uses **7 PostgreSQL tables** managed via Drizzle ORM:

#### 1. **users**
Stores user account information.
```typescript
{
  id: uuid (PK, from auth.users.id)
  name: text
  email: text (unique)
  isSuper: boolean (admin flag)
  profilePhoto: text
  createdAt: timestamp
}
```

#### 2. **subscriptions**
Manages user subscription data and Stripe integration.
```typescript
{
  id: uuid (PK)
  userId: uuid (FK → users.id)
  plan: enum ('free', 'pro', 'go')
  planKey: text
  status: enum ('active', 'cancelled', 'past_due', 'trialing', 'unpaid')
  stripeCustomerId: text (unique)
  stripeSubscriptionId: text (unique)
  subscriptionStart: timestamp
  subscriptionEnd: timestamp
  lastBilledAt: timestamp
  invoiceLink: text
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 3. **limits**
Defines usage limits for each user based on their subscription.
```typescript
{
  id: uuid (PK)
  userId: uuid (FK → users.id, unique)
  subscriptionId: uuid (FK → subscriptions.id)
  storageLimitBytes: bigint (default: 10GB)
  formsLimit: integer (default: 5)
  submissionsLimit: integer (default: 20)
  audioMinutesLimit: integer (default: 120)
  videoMinutesLimit: integer (default: 0)
  videoIntelligenceEnabled: boolean (default: false)
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 4. **usage**
Tracks current usage for each user.
```typescript
{
  id: uuid (PK)
  userId: uuid (FK → users.id, unique)
  subscriptionId: uuid (FK → subscriptions.id)
  storageUsedBytes: bigint (default: 0)
  audioMinutesTranscribed: numeric (default: 0.00)
  videoMinutesUsed: numeric (default: 0.00)
  formsCreatedCount: integer (default: 0)
  submissionsCount: integer (default: 0)
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 5. **forms**
Stores user-created collection forms.
```typescript
{
  id: uuid (PK)
  userId: uuid (FK → users.id)
  name: text
  submissions: integer (default: 0)
  status: enum ('active', 'completed')
  createdAt: timestamp
}
```

#### 6. **submissions**
Stores video submissions and AI-generated content.
```typescript
{
  id: uuid (PK)
  userId: uuid (FK → users.id)
  formId: uuid (FK → forms.id)
  filesSubmissionId: uuid
  data: jsonb (form field data)
  
  // File URLs and paths
  videoUrl: text
  videoUrlPath: text
  transcript: text (AI-generated)
  summary: text (AI-generated)
  videoSummary: text (AI-generated video insights)
  jsonResultUrl: text
  jsonResultUrlPath: text
  markdownUrl: text
  markdownUrlPath: text
  filesSize: bigint
  
  // Processing status
  status: enum ('pending', 'completed', 'failed')
  errorMessage: text
  processedAt: timestamp
  createdAt: timestamp
}
```

#### 7. **contact_queries**
Stores contact form submissions for admin review.
```typescript
{
  id: uuid (PK)
  name: text
  email: text
  subject: text
  message: text
  isResolved: boolean (default: false)
  createdAt: timestamp
}
```

### Database Indexes
- `subscriptions_user_idx`, `subscriptions_stripe_customer_idx`, `subscriptions_stripe_subscription_idx`
- `usage_user_idx`, `usage_subscription_idx`
- `limits_user_idx`, `limits_subscription_idx`
- `forms_user_idx`
- `submissions_form_idx`

---

## ✨ Features

### 🔐 Authentication & Authorization
- **Supabase Auth**: Email/password authentication
- **Protected Routes**: Middleware-based route protection
- **Admin System**: Role-based access control with `isSuper` flag
- **Session Management**: Secure JWT-based sessions

### 📝 Form Management
- **Custom Forms**: Create unlimited forms (based on plan limits)
- **Public Links**: Shareable form URLs for collecting submissions
- **Form Status**: Active/Completed status management
- **Submission Tracking**: Real-time submission count

### 🎥 Video Submission Collection
- **Browser Recording**: In-browser video recording
- **File Upload**: Direct video file upload
- **Mobile Support**: Responsive design for mobile devices
- **Contact Methods**: Email and/or phone number collection
- **Custom Fields**: Additional form fields support

### 🤖 AI-Powered Processing

#### Automatic Transcription
- **AssemblyAI Integration**: High-accuracy transcription
- **Speaker Diarization**: Identifies different speakers
- **Timestamps**: Precise timing for each segment
- **Multiple Languages**: Support for various languages

#### Smart Summarization
- **OpenAI GPT-4.1 Nano**: Advanced text summarization
- **Action Points**: Extracted actionable items
- **Key Insights**: Important highlights
- **Structured Output**: JSON and Markdown formats

#### Video Intelligence (Pro Plan Only)
- **Google Gemini 2.0 Flash-Lite**: Advanced video understanding
- **Visual Analysis**: Scene detection, object recognition
- **Content Insights**: Detailed video content analysis
- **Problem-Solution Mapping**: AI-identified issues and recommendations
- **Processing Time**: Minutes to hours depending on video length

### 💳 Subscription & Billing
- **Stripe Integration**: Secure payment processing
- **Multiple Plans**: Free, Go, and Pro tiers
- **Billing Intervals**: Monthly and yearly options
- **Automatic Renewal**: Managed by Stripe
- **Invoice Management**: Automatic invoice generation
- **Billing Portal**: Self-service subscription management

### 📊 Usage Tracking & Limits
- **Real-time Monitoring**: Live usage statistics
- **Dynamic Limits**: Plan-based restrictions
- **Storage Tracking**: File size monitoring
- **Minute Tracking**: Audio/video processing minutes
- **Quota Enforcement**: Automatic limit checks
- **Usage Alerts**: Visual indicators for quota usage

### 👨‍💼 Admin Panel
- **User Management**: View and manage all users
- **Admin Role Toggle**: Grant/revoke admin access
- **Subscription Overview**: View all subscriptions
- **Limit Management**: Edit user limits
- **Contact Queries**: View and manage contact form submissions
- **Statistics Dashboard**: Key metrics and analytics
- **Server-Side Rendering**: Optimized performance

### 📧 Contact System
- **Public Contact Form**: `/contact` page
- **Admin Management**: Resolve/delete queries
- **Status Tracking**: Resolved/pending states
- **Email Notifications**: (Future enhancement)

### 🎨 UI/UX Features
- **Dark/Light Mode**: System-aware theme switching
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Framer Motion transitions
- **Loading States**: Skeleton loaders and spinners
- **Toast Notifications**: User feedback system
- **Modern Design**: Glassmorphism, gradients, shadows

---

## 💰 Subscription Plans

### Plan Comparison

| Feature | Go Plan | Pro Plan |
|---------|---------|----------|
| **Storage** | 10 GB | 50 GB |
| **Forms** | 5 | 20 |
| **Submissions** | 20 | 100 |
| **Audio Minutes** | 120 | 600 |
| **Video Minutes** | 0 | 300 |
| **Video Intelligence** | ❌ | ✅ |
| **Billing** | Monthly/Yearly | Monthly/Yearly |

### Plan Configuration
Plans are configured via environment variables and managed in `src/lib/stripe/config.ts`:

```typescript
PLAN_CONFIG = {
  go: {
    stripePriceId: {
      monthly: process.env.GO_PRICE_ID_MONTHLY,
      yearly: process.env.GO_PRICE_ID_YEARLY
    },
    limits: { /* ... */ }
  },
  pro: {
    stripePriceId: {
      monthly: process.env.PRO_PRICE_ID_MONTHLY,
      yearly: process.env.PRO_PRICE_ID_YEARLY
    },
    limits: { /* ... */ }
  }
}
```

---

## 🔄 AI Processing Workflows

All AI processing is handled by **N8N workflows** hosted at `https://eisoftware.app.n8n.cloud`.

### 1. Stripe Webhook Workflow
**URL**: https://eisoftware.app.n8n.cloud/workflow/1T0KqrqoulC3qPlb

**Purpose**: Handles all Stripe webhook events for subscription management.

**Process**:
1. Receives webhook from Next.js API (`/api/webhooks/stripe`)
2. Verifies Stripe signature (done in Next.js)
3. Routes events based on type:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Updates database tables:
   - `subscriptions`: Plan, status, Stripe IDs
   - `limits`: Plan-based limits
   - `usage`: Resets or maintains usage
5. Handles edge cases (upgrades, downgrades, cancellations)

**Key Features**:
- Idempotent operations
- Error handling and logging
- Automatic limit initialization
- Invoice link storage

### 2. Transcription Workflow
**URL**: https://eisoftware.app.n8n.cloud/workflow/wmwpEjS7th3cTp4m

**Purpose**: Processes video submissions for transcription and summarization.

**Process**:
1. **Trigger**: Receives webhook after video upload
   - Payload: `userId`, `formId`, `submissionId`, `videoUrl`
2. **AssemblyAI Transcription**:
   - Uploads video URL to AssemblyAI
   - Enables speaker diarization
   - Waits for processing completion
   - Retrieves transcript with timestamps and speaker labels
3. **OpenAI Summarization**:
   - Sends transcript to GPT-4.1 Nano
   - Generates summary with action points
   - Extracts key insights
   - Uses N8N free OpenAI credits (100 credits)
4. **File Generation**:
   - Creates JSON file with structured data
   - Creates Markdown file with formatted summary
   - Uploads both to Supabase Storage
5. **Database Update**:
   - Updates `submissions` table with:
     - `transcript`, `summary`
     - `jsonResultUrl`, `jsonResultUrlPath`
     - `markdownUrl`, `markdownUrlPath`
     - `filesSize`, `status`, `processedAt`
6. **Usage Update**:
   - Increments `storageUsedBytes` in `usage` table
   - Increments `audioMinutesTranscribed`
   - Calls `/api/n8n/increment-usage` endpoint

**Technologies**:
- **AssemblyAI**: Owned by Eli Isaac, ESI Inc.
- **OpenAI GPT-4.1 Nano**: Currently using N8N free credits
- **Supabase Storage**: File storage

**Future Enhancement**: Will require paid OpenAI API key when N8N credits expire.

### 3. Video Intelligence Workflow
**URL**: https://eisoftware.app.n8n.cloud/workflow/bRO4fOjVWCKgQL2g

**Purpose**: Provides deep video analysis and insights using Google Gemini.

**Process**:
1. **Trigger**: User clicks "Process with AI" button
   - API validates Pro plan + video intelligence enabled
   - Webhook sent with: `formId`, `userId`, `fileSubmissionId`, `videoUrl`
2. **Google Cloud Storage Upload**:
   - Downloads video from Supabase
   - Uploads to GCS bucket: `temp-video-processing`
   - Bucket lifecycle: Auto-delete after 24 hours (cost optimization)
3. **Manifest File Creation**:
   - Creates JSON manifest with:
     - Video analysis prompt
     - GCS video URL
     - Processing parameters
   - Uploads manifest to same GCS bucket
4. **Vertex AI Processing**:
   - Submits manifest to Gemini 2.0 Flash-Lite
   - Model: `gemini-2.0-flash-lite`
   - Pricing: $0.10 per million tokens (input)
   - Free tier: $300 credits + 1000 free minutes
5. **Polling & Completion**:
   - Polls Vertex AI for processing status
   - Waits for completion (minutes to hours)
   - Retrieves generated insights
6. **Database Update**:
   - Updates `submissions.videoSummary` field
   - Updates `usage.videoMinutesUsed`
   - Marks processing as complete

**Technologies**:
- **Google Cloud Storage**: Temporary video storage
- **Vertex AI**: Gemini 2.0 Flash-Lite model
- **Google Cloud Platform**: $300 free credits

**Cost Considerations**:
- Token-based pricing: $0.10 per million input tokens
- Free tier: 1000 minutes of processing
- After free tier: User charged based on token usage
- Video length affects processing time and cost

---

## 🚀 Deployment

### Hosting Platform
- **Platform**: [Vercel](https://vercel.com/)
- **Reason**: Optimized for Next.js deployments
- **Branch**: `main` (auto-deploy on push)
- **Repository**: https://github.com/elisisaac/Expert-Advice
- **Owner**: Eli Isaac

### Deployment Configuration
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node Version**: 20.x

### Environment Variables
All environment variables must be configured in Vercel dashboard:
- Database credentials
- Supabase keys
- Stripe keys
- N8N webhook URLs
- Plan configurations

### Continuous Deployment
- **Trigger**: Push to `main` branch
- **Build Time**: ~2-3 minutes
- **Automatic**: Yes
- **Preview Deployments**: Enabled for PRs

---

## 🔧 Environment Variables

### Required Environment Variables

```bash
# Database
DATABASE_URL=postgresql://...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Stripe (TEST MODE - will change to live after testing)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Go Plan Price IDs
GO_PRICE_ID_MONTHLY=price_...
GO_PRICE_ID_YEARLY=price_...

# Pro Plan Price IDs
PRO_PRICE_ID_MONTHLY=price_...
PRO_PRICE_ID_YEARLY=price_...

# Go Plan Limits
GO_STORAGE_LIMIT_BYTES=10737418240  # 10GB
GO_FORMS_LIMIT=5
GO_SUBMISSIONS_LIMIT=20
GO_AUDIO_MINUTES_LIMIT=120
GO_VIDEO_MINUTES_LIMIT=0
GO_VIDEO_INTELLIGENCE=false

# Pro Plan Limits
PRO_STORAGE_LIMIT_BYTES=53687091200  # 50GB
PRO_FORMS_LIMIT=20
PRO_SUBMISSIONS_LIMIT=100
PRO_AUDIO_MINUTES_LIMIT=600
PRO_VIDEO_MINUTES_LIMIT=300
PRO_VIDEO_INTELLIGENCE=true

# N8N Webhooks
N8N_TRANSCRIPTION_WEBHOOK_URL=https://eisoftware.app.n8n.cloud/webhook/...
N8N_VIDEO_ANALYSIS_URL=https://eisoftware.app.n8n.cloud/webhook/...
N8N_STRIPE_WEBHOOK_URL=https://eisoftware.app.n8n.cloud/webhook/...

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

---

## 💻 Development

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL database (or Supabase account)
- Stripe account (test mode)
- N8N instance (or access to workflows)

### Installation

```bash
# Clone repository
git clone https://github.com/elisisaac/Expert-Advice.git
cd Expert-Advice

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Run database migrations
npx drizzle-kit push

# Start development server
npm run dev
```

### Development Scripts

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code
npm run format

# Generate database migrations
npx drizzle-kit generate

# Push schema to database
npx drizzle-kit push

# Open Drizzle Studio (database GUI)
npx drizzle-kit studio
```

### Database Management

The project uses **Drizzle ORM** for type-safe database operations.

**Schema Location**: `drizzle/schema.ts`

**Common Commands**:
```bash
# Generate migration from schema changes
npx drizzle-kit generate

# Apply migrations to database
npx drizzle-kit push

# View database in browser
npx drizzle-kit studio
```

**Migration Workflow**:
1. Modify `drizzle/schema.ts`
2. Run `npx drizzle-kit generate` to create migration
3. Review migration in `drizzle/migrations/`
4. Run `npx drizzle-kit push` to apply
5. Commit schema and migration files

### Project Structure Best Practices
- **Server Components**: Use for data fetching (default in App Router)
- **Client Components**: Mark with `'use client'` for interactivity
- **API Routes**: Keep business logic in `/api` routes
- **Type Safety**: Define types in `src/lib/types/`
- **Reusable Logic**: Create utilities in `src/lib/`
- **State Management**: Use Zustand for complex client state

---

## ⚠️ Important Notes

### 🔴 Critical Production Considerations

#### 1. Stripe Test Mode
- **Current Status**: Using Stripe **TEST MODE**
- **Action Required**: After testing period, switch to **LIVE MODE**
- **Steps**:
  1. Create live products and prices in Stripe Dashboard
  2. Update environment variables with live keys:
     - `STRIPE_SECRET_KEY=sk_live_...`
     - `STRIPE_PUBLISHABLE_KEY=pk_live_...`
     - `STRIPE_WEBHOOK_SECRET=whsec_live_...`
  3. Update all price IDs (GO/PRO monthly/yearly)
  4. Test thoroughly in staging environment
  5. Deploy to production

#### 2. OpenAI API Credits
- **Current**: Using N8N free OpenAI credits (100 credits)
- **Limitation**: Will expire after usage
- **Action Required**: Set up paid OpenAI API key
- **Steps**:
  1. Create OpenAI account
  2. Add payment method
  3. Generate API key
  4. Update N8N Transcription Workflow with new key
  5. Monitor usage and costs

#### 3. Google Cloud Costs
- **Free Tier**: $300 credits + 1000 free minutes
- **After Free Tier**: $0.10 per million tokens (input)
- **Monitoring**: Set up billing alerts in GCP
- **Optimization**: 
  - 24-hour lifecycle rule on GCS bucket
  - Use Gemini 2.0 Flash-Lite (cost-effective)
  - Monitor token usage

#### 4. AssemblyAI Account
- **Owner**: Eli Isaac, ESI Inc.
- **Access**: Ensure account remains active
- **Billing**: Monitor transcription usage
- **Backup**: Have contingency plan for API key rotation

#### 5. N8N Workflows
- **Hosting**: `https://eisoftware.app.n8n.cloud`
- **Critical Workflows**:
  - Stripe Webhook Handler
  - Transcription Processor
  - Video Intelligence Analyzer
- **Monitoring**: Set up alerts for workflow failures
- **Backup**: Export workflow JSON regularly

#### 6. Database Backups
- **Supabase**: Automatic backups enabled
- **Frequency**: Daily
- **Retention**: 7 days (free tier)
- **Recommendation**: Upgrade to longer retention for production

#### 7. Security Checklist
- [ ] Rotate all API keys before production launch
- [ ] Enable Stripe webhook signature verification
- [ ] Set up rate limiting on API routes
- [ ] Configure CORS properly
- [ ] Enable Supabase Row Level Security (RLS)
- [ ] Set up monitoring and error tracking (Sentry/LogRocket)
- [ ] Configure CSP headers
- [ ] Enable HTTPS only
- [ ] Set up DDoS protection (Vercel provides basic protection)

#### 8. Performance Optimization
- [ ] Enable Next.js Image Optimization
- [ ] Configure CDN for static assets
- [ ] Set up Redis for caching (future)
- [ ] Optimize database queries with indexes
- [ ] Monitor Core Web Vitals
- [ ] Set up performance monitoring

#### 9. Legal & Compliance
- [ ] Add Terms of Service
- [ ] Add Privacy Policy
- [ ] GDPR compliance (if serving EU users)
- [ ] Cookie consent banner
- [ ] Data retention policies
- [ ] User data export/deletion features

#### 10. Monitoring & Alerts
- [ ] Set up Vercel Analytics
- [ ] Configure error tracking
- [ ] Set up uptime monitoring
- [ ] Create Slack/email alerts for:
  - Stripe webhook failures
  - N8N workflow errors
  - Database connection issues
  - API rate limit hits
  - Storage quota warnings

---

## 📞 Support & Contact

- **Repository**: https://github.com/elisisaac/Expert-Advice
- **Owner**: Eli Isaac
- **Organization**: ESI Inc.

---

## 📄 License

Proprietary - All rights reserved by ESI Inc.

---

## 🙏 Acknowledgments

- **AssemblyAI**: Transcription services
- **OpenAI**: GPT-4 summarization
- **Google Cloud**: Vertex AI and Cloud Storage
- **Stripe**: Payment processing
- **Supabase**: Backend infrastructure
- **Vercel**: Hosting platform
- **N8N**: Workflow automation

---

**Last Updated**: December 24, 2024
**Version**: 1.0.0
**Status**: Production Ready (pending Stripe live mode switch)
