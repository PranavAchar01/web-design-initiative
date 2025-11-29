import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  // Handle the event
  console.log(`✅ Webhook received: ${event.type}`)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('💳 Checkout session completed:', session.id)

        // TODO: Create or update user subscription in database
        // Example:
        // await prisma.subscription.create({
        //   data: {
        //     userId: session.client_reference_id,
        //     stripeCustomerId: session.customer as string,
        //     stripeSubscriptionId: session.subscription as string,
        //     status: 'active',
        //   },
        // })

        console.log(`✅ Subscription created for customer: ${session.customer}`)
        break
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('📝 Subscription created:', subscription.id)

        // TODO: Update subscription status in database
        // await prisma.subscription.update({
        //   where: { stripeSubscriptionId: subscription.id },
        //   data: { status: 'active' },
        // })

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('🔄 Subscription updated:', subscription.id)

        // TODO: Update subscription details in database
        // await prisma.subscription.update({
        //   where: { stripeSubscriptionId: subscription.id },
        //   data: {
        //     status: subscription.status,
        //     currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        //   },
        // })

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('❌ Subscription cancelled:', subscription.id)

        // TODO: Mark subscription as cancelled in database
        // await prisma.subscription.update({
        //   where: { stripeSubscriptionId: subscription.id },
        //   data: { status: 'cancelled' },
        // })

        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('💰 Invoice paid:', invoice.id)

        // TODO: Update payment history in database
        // await prisma.payment.create({
        //   data: {
        //     stripeInvoiceId: invoice.id,
        //     amount: invoice.amount_paid,
        //     status: 'paid',
        //   },
        // })

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('⚠️ Invoice payment failed:', invoice.id)

        // TODO: Handle failed payment (send notification, update status)
        // await prisma.subscription.update({
        //   where: { stripeCustomerId: invoice.customer as string },
        //   data: { status: 'past_due' },
        // })

        // Send email notification to customer
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('✅ Payment succeeded:', paymentIntent.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('❌ Payment failed:', paymentIntent.id)
        break
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
