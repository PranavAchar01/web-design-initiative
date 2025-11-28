import { z } from "zod"

// Order validations
export const createOrderSchema = z.object({
  packageType: z.enum(["BASIC", "STANDARD", "PREMIUM", "CUSTOM"]),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  requirements: z.string().optional(),
  totalAmount: z.number().positive("Amount must be positive"),
})

export const updateOrderSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  description: z.string().optional(),
  requirements: z.string().optional(),
})

// Payment validations
export const createPaymentIntentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
})

// Testimonial validations
export const createTestimonialSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
})

export const updateTestimonialSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().min(10).optional(),
  isPublic: z.boolean().optional(),
})

// Message validations
export const createMessageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export const updateMessageSchema = z.object({
  isRead: z.boolean(),
})

// Deliverable validations
export const createDeliverableSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  fileUrl: z.string().url("Invalid file URL").optional(),
})

export const updateDeliverableSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  fileUrl: z.string().url().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "REVISION_REQUESTED"]).optional(),
})

// User validations
export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(["CLIENT", "ADMIN"]).optional(),
})

// Type exports
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>
export type CreatePaymentIntentInput = z.infer<typeof createPaymentIntentSchema>
export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>
export type CreateMessageInput = z.infer<typeof createMessageSchema>
export type UpdateMessageInput = z.infer<typeof updateMessageSchema>
export type CreateDeliverableInput = z.infer<typeof createDeliverableSchema>
export type UpdateDeliverableInput = z.infer<typeof updateDeliverableSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
