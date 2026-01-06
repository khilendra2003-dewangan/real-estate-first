import { z } from "zod";

// User Signup Schema
export const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  contact: z
    .string()
    .regex(/^[0-9]{10}$/, "Contact must be a valid 10-digit number"),
  role: z.enum(["user", "admin", "agent"]).optional(),
});

// Agent Signup Schema (extends user signup with agent-specific fields)
export const agentSignupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  contact: z
    .string()
    .regex(/^[0-9]{10}$/, "Contact must be a valid 10-digit number"),
  role: z.literal("agent"),
  agencyName: z.string().min(2, "Agency name is required").optional(),
  licenseNumber: z.string().optional(),
  experience: z.coerce.number().min(0).optional(),
  specialization: z.array(z.string()).optional(),
});

// Login Schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// Property Schema
export const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  propertyType: z.enum(["sale", "rent"]),
  category: z.string().min(1, "Category is required"),
  location: z.object({
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    country: z.string().min(2, "Country is required"),
    pincode: z.string().regex(/^[0-9]{6}$/, "Pincode must be 6 digits"),
  }),
  bedrooms: z.coerce.number().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  area: z.coerce.number().positive("Area must be a positive number"),
  amenities: z.object({
    parking: z.boolean().optional(),
    lift: z.boolean().optional(),
    security: z.boolean().optional(),
    garden: z.boolean().optional(),
    gym: z.boolean().optional(),
    swimmingPool: z.boolean().optional(),
    powerBackup: z.boolean().optional(),
    waterSupply: z.boolean().optional(),
    clubhouse: z.boolean().optional(),
    playground: z.boolean().optional(),
  }).optional(),
  furnishing: z.enum(["unfurnished", "semi-furnished", "fully-furnished"]).optional(),
  facing: z.enum(["north", "south", "east", "west", "north-east", "north-west", "south-east", "south-west"]).optional(),
  floorNumber: z.coerce.number().optional(),
  totalFloors: z.coerce.number().optional(),
  ageOfProperty: z.coerce.number().optional(),
});

// Property Update Schema (all fields optional)
export const propertyUpdateSchema = propertySchema.partial();

// Category Schema
export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  description: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().optional(),
});

// Inquiry Schema
export const inquirySchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  contactName: z.string().min(2, "Contact name is required"),
  contactEmail: z.string().email("Invalid email format"),
  contactPhone: z.string().regex(/^[0-9]{10}$/, "Contact must be a valid 10-digit number"),
});

// Visit Schedule Schema
export const visitSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
  scheduledDate: z.string().min(1, "Scheduled date is required"),
  scheduledTime: z.string().min(1, "Scheduled time is required"),
  contactName: z.string().min(2, "Contact name is required"),
  contactPhone: z.string().regex(/^[0-9]{10}$/, "Contact must be a valid 10-digit number"),
  notes: z.string().optional(),
});

// Visit Status Update Schema
export const visitStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled", "rescheduled"]),
  agentRemarks: z.string().optional(),
  cancellationReason: z.string().optional(),
});
