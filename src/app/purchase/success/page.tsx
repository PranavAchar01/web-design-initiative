'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { getCheckoutSession } from '@/app/actions/stripe'

function SuccessContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [customerEmail, setCustomerEmail] = useState<string | null>(null)

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
        } else {
          setStatus('error')
        }
      })
      .catch(() => {
        setStatus('error')
      })
  }, [searchParams])

  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center px-4">
      <motion.div
        className="max-w-2xl w-full bg-slate-900 border-2 border-cyan-400 rounded-lg p-8 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {status === 'loading' && (
          <div className="font-mono text-cyan-400">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p>$ Processing payment...</p>
          </div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">✓</div>
            <h1 className="text-4xl font-bold text-cyan-400 font-mono mb-4">
              $ Payment Successful
            </h1>
            <p className="text-gray-300 font-mono mb-2">
              Thank you for your purchase!
            </p>
            {customerEmail && (
              <p className="text-gray-400 font-mono text-sm mb-6">
                Confirmation sent to: {customerEmail}
              </p>
            )}
            <div className="space-y-4 mt-8">
              <p className="text-gray-300 font-mono text-sm">
                {'>'} Our team will contact you within 24 hours to begin your project.
              </p>
              <Link href="/">
                <motion.button
                  className="px-8 py-3 bg-transparent border-2 border-cyan-400 text-cyan-400 font-mono rounded-lg hover:bg-cyan-400 hover:text-slate-900 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Return to Home
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">✗</div>
            <h1 className="text-4xl font-bold text-red-400 font-mono mb-4">
              $ Payment Error
            </h1>
            <p className="text-gray-300 font-mono mb-6">
              Something went wrong with your payment.
            </p>
            <div className="space-x-4">
              <Link href="/purchase">
                <motion.button
                  className="px-8 py-3 bg-transparent border-2 border-cyan-400 text-cyan-400 font-mono rounded-lg hover:bg-cyan-400 hover:text-slate-900 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Try Again
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
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
