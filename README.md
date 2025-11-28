# Web Design Initiative

A modern web design agency website built with Next.js 16, featuring terminal-style aesthetics, interactive animations, and Stripe payment integration.

## Features

- **Terminal-Inspired UI**: Minimalistic command-line aesthetic throughout the site
- **Interactive Animations**:
  - Morphing blob backgrounds
  - Particle systems with mouse interaction
  - 3D wireframe cubes (desktop only)
  - Typewriter text effects
- **Stripe Integration**: Subscription-based pricing with checkout flow
- **Authentication**: NextAuth.js with Prisma adapter
- **Database**: Prisma with Prisma Accelerate for edge runtime
- **Responsive Design**: Optimized for all devices with progressive enhancement
- **Service Tiers**:
  - Student: $20/month
  - Professional: $100/month
  - Enterprise: Custom pricing (contact form)

## Tech Stack

- **Framework**: Next.js 16.0.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, Three.js (React Three Fiber)
- **Database**: Prisma with PostgreSQL (Prisma Accelerate)
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Stripe account (for payments)
- Prisma Postgres database or compatible PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd web-design-initiative
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Fill in the required values in `.env`:

   ```env
   # Database
   DATABASE_URL="your-prisma-accelerate-url"
   DIRECT_URL="your-direct-database-url"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_STUDENT_PRICE_ID="price_..."
   STRIPE_PROFESSIONAL_PRICE_ID="price_..."

   # Optional: Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up Prisma**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the site.

## Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/products)
2. Create two products:
   - **Student Plan**: $20/month recurring
   - **Professional Plan**: $100/month recurring
3. Copy the price IDs (start with `price_`) and add them to your `.env` file

## Deployment on Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/web-design-initiative)

### Manual Deployment

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/web-design-initiative.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure your project:
     - Framework Preset: Next.js
     - Root Directory: `./`
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Set Environment Variables in Vercel**

   In your Vercel project settings, add all environment variables from your `.env` file:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXTAUTH_URL` (use your production URL)
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_STUDENT_PRICE_ID`
   - `STRIPE_PROFESSIONAL_PRICE_ID`
   - `GOOGLE_CLIENT_ID` (optional)
   - `GOOGLE_CLIENT_SECRET` (optional)
   - `NEXT_PUBLIC_BASE_URL` (your production URL)

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your site

### Post-Deployment

1. **Update Stripe Webhooks** (optional, for production):
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events to listen for
   - Copy webhook secret to `STRIPE_WEBHOOK_SECRET` in Vercel

2. **Configure OAuth Redirect URLs**:
   - Google Cloud Console: Add `https://yourdomain.com/api/auth/callback/google`
   - Update `NEXTAUTH_URL` in Vercel to your production domain

## Project Structure

```
web-design-initiative/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── actions/           # Server actions (Stripe, etc.)
│   │   ├── api/               # API routes
│   │   ├── purchase/          # Purchase page and success page
│   │   └── ...
│   ├── components/            # React components
│   ├── context/               # Hero components and configs
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities (Prisma, Auth)
│   ├── middleware.ts          # NextAuth middleware
│   └── types/                 # TypeScript type definitions
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── .env.example               # Environment variables template
└── ...
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema changes to database

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Prisma Accelerate connection URL | Yes |
| `DIRECT_URL` | Direct database connection URL | Yes |
| `NEXTAUTH_URL` | Your site URL | Yes |
| `NEXTAUTH_SECRET` | Random secret for NextAuth | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_STUDENT_PRICE_ID` | Stripe price ID for Student tier | Yes |
| `STRIPE_PROFESSIONAL_PRICE_ID` | Stripe price ID for Professional tier | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open an issue on GitHub or contact us through the website.
