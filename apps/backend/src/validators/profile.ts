import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  phone: z.string().refine((val) => {
    const cleaned = val.replace(/[\s()-]/g, '');
    return /^\+?[1-9]\d{6,14}$/.test(cleaned);
  }, 'Invalid international phone number format').optional(),
  phoneNumber: z.string().refine((val) => {
    const cleaned = val.replace(/[\s()-]/g, '');
    return /^\+?[1-9]\d{6,14}$/.test(cleaned);
  }, 'Invalid international phone number format').optional(),
  companyName: z.string().min(1, 'Company name is required').optional(),
  dotNumber: z.string().optional(),
  mcNumber: z.string().optional(),
  equipmentTypes: z.array(z.string()).optional(),
  operatingRegions: z.array(z.string()).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
