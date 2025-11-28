// Centralized type definitions
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  isStudent: boolean
  company?: string
  createdAt: Date
}

export interface Order {
  id: string
  userId: string
  plan: 'student' | 'business' | 'premium'
  amount: number
  status: 'pending' | 'in-progress' | 'completed'
  projectDetails: string
  createdAt: Date
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  company?: string
  message: string
  interest: string
  status: 'new' | 'read' | 'replied'
  createdAt: Date
}

export interface Testimonial {
  id: string
  name: string
  company: string
  quote: string
  avatar: string
  logo?: string
  rating?: number
}

export interface Client {
  name: string
  logo: string
}

export interface ProcessStep {
  step: number
  title: string
  description: string
}

export interface Feature {
  title: string
  icon: string
  description?: string
}
