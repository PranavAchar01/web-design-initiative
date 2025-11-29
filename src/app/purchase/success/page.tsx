'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { getCheckoutSession } from '@/app/actions/stripe'

function SuccessContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [customerEmail, setCustomerEmail] = useState<string | null>(null)
  const [planName, setPlanName] = useState<string | null>(null)
  const [amount, setAmount] = useState<number | null>(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      setStatus('error')
      return
    }

    getCheckoutSession(sessionId)
      .then((session) => {
        if (session.payment_status === 'paid') {
          setStatus('success')
          setCustomerEmail(session.customer_details?.email || null)
          // Extract plan details from line items if available
          if (session.line_items?.data?.[0]) {
            setPlanName(session.line_items.data[0].description || null)
          }
          setAmount(session.amount_total ? session.amount_total / 100 : null)
        } else {
          setStatus('error')
        }
      })
      .catch(() => {
        setStatus('error')
      })
  }, [searchParams])

  return (
    <div className="min-h-screen bg-primary-dark relative overflow-hidden flex items-center justify-center px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-gray-900 to-primary-dark" />

      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 max-w-3xl w-full rounded-lg p-8 md:p-12 text-center"
        style={{
          backgroundColor: 'rgba(13, 18, 30, 0.8)',
          border: '1px solid rgba(50, 184, 198, 0.2)',
          boxShadow: '0 8px 32px rgba(50, 184, 198, 0.1)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <AnimatePresence mode="wait">
          {status === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-mono text-cyan-400"
            >
              <div className="flex justify-center mb-6">
                <svg className="animate-spin h-16 w-16" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <p className="text-lg">$ verifying_payment.sh</p>
              <p className="text-sm text-gray-400 mt-2">Processing your subscription...</p>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Success checkmark animation */}
              <motion.div
                className="w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '2px solid #22C55E' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <svg className="w-14 h-14 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </svg>
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-bold text-green-400 font-mono mb-4">
                $ payment_confirmed.sh
              </h1>

              <p className="text-xl text-gray-200 font-mono mb-6">
                {'>'} Subscription activated successfully!
              </p>

              {/* Order details */}
              <div className="bg-black bg-opacity-30 rounded-lg p-6 mb-8 text-left border border-gray-700">
                <div className="font-mono text-sm space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                    <span className="text-gray-400">$ cat order_details.txt</span>
                  </div>

                  {customerEmail && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-cyan-400">{customerEmail}</span>
                    </div>
                  )}

                  {planName && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Plan:</span>
                      <span className="text-cyan-400">{planName}</span>
                    </div>
                  )}

                  {amount && (
                    <div className="flex justify-between pt-3 border-t border-gray-700">
                      <span className="text-gray-400">Total:</span>
                      <span className="text-green-400 font-semibold">${amount.toFixed(2)}/month</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Next steps */}
              <div className="bg-cyan-500 bg-opacity-5 rounded-lg p-6 mb-8 border border-cyan-500 border-opacity-20">
                <h3 className="font-mono text-cyan-400 text-lg mb-4">$ ./next_steps.sh</h3>
                <ul className="text-left space-y-3 font-mono text-sm text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 flex-shrink-0">01.</span>
                    <span>Check your email for a detailed receipt and welcome guide</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 flex-shrink-0">02.</span>
                    <span>Our team will contact you within 24 hours to discuss your project</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 flex-shrink-0">03.</span>
                    <span>You can manage your subscription anytime from your account dashboard</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/" className="w-full sm:w-auto">
                  <motion.button
                    className="w-full px-8 py-4 bg-cyan-400 text-gray-900 font-mono font-semibold rounded-lg shadow-lg transition-all duration-200"
                    style={{ boxShadow: '0 4px 12px rgba(50, 184, 198, 0.3)' }}
                    whileHover={{ scale: 1.02, boxShadow: '0 6px 20px rgba(50, 184, 198, 0.5)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Return Home
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '2px solid #EF4444' }}>
                <svg className="w-14 h-14 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-red-400 font-mono mb-4">
                $ payment_failed.sh
              </h1>

              <p className="text-xl text-gray-200 font-mono mb-8">
                {'>'} We couldn't process your payment
              </p>

              <div className="bg-red-500 bg-opacity-5 rounded-lg p-6 mb-8 border border-red-500 border-opacity-20">
                <p className="text-gray-300 font-mono text-sm">
                  Please check your payment details and try again. If the problem persists, contact our support team.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/purchase" className="w-full sm:w-auto">
                  <motion.button
                    className="w-full px-8 py-4 bg-cyan-400 text-gray-900 font-mono font-semibold rounded-lg shadow-lg transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Try Again
                  </motion.button>
                </Link>
                <Link href="/" className="w-full sm:w-auto">
                  <motion.button
                    className="w-full px-8 py-4 bg-transparent border-2 border-gray-600 text-gray-300 font-mono rounded-lg transition-all duration-200"
                    whileHover={{ borderColor: 'rgba(156, 163, 175, 0.5)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Return Home
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-primary-dark flex items-center justify-center">
          <div className="font-mono text-cyan-400">Loading...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
