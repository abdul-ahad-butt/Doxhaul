import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  companyName: z.string().min(1, 'Company name is required'),
  role: z.enum(['SHIPPER', 'BROKER', 'CARRIER']),
  
  // Carrier specific
  dotNumber: z.string().optional(),
  mcNumber: z.string().optional(),
  equipmentTypes: z.array(z.string()).optional(),
  operatingRegions: z.array(z.string()).optional(),
  
  // Address
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().default('US'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
