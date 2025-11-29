'use server'

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
})

const tierPriceIds: Record<string, string> = {
  student: process.env.STRIPE_STUDENT_PRICE_ID || '',
  professional: process.env.STRIPE_PROFESSIONAL_PRICE_ID || '',
}

export async function createCheckoutSession(tier: 'student' | 'professional' | 'enterprise') {
  // For enterprise, return contact URL
  if (tier === 'enterprise') {
    return {
      url: '/contact',
      isContactForm: true,
    }
  }

  const priceId = tierPriceIds[tier]

  if (!priceId) {
    throw new Error(`No price ID configured for tier: ${tier}`)
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/purchase`,
    })

    return {
      url: session.url,
      sessionId: session.id,
    }
  } catch (error) {
    console.error('Stripe checkout session error:', error)
    throw new Error('Failed to create checkout session')
  }
}

export async function getCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer']
    })
    return session
  } catch (error) {
    console.error('Failed to retrieve session:', error)
    throw new Error('Failed to retrieve checkout session')
  }
}
