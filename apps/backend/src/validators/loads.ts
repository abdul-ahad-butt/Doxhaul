import { z } from 'zod';

export const createLoadSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  originCity: z.string().min(1, 'Origin city is required'),
  originState: z.string().min(2, 'Origin state is required'),
  originZip: z.string().optional(),
  originCountry: z.string().default('US'),
  destinationCity: z.string().min(1, 'Destination city is required'),
  destinationState: z.string().min(2, 'Destination state is required'),
  destinationZip: z.string().optional(),
  destinationCountry: z.string().default('US'),
  pickupDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  deliveryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  equipmentType: z.enum(['DRY_VAN', 'REEFER', 'FLATBED', 'STEP_DECK', 'BOX_TRUCK', 'TANKER', 'LOWBOY', 'OTHER']),
  weight: z.number().positive('Weight must be positive'),
  weightUnit: z.string().default('LBS'),
  length: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  commodity: z.string().optional(),
  rate: z.number().positive('Rate must be positive'),
  currency: z.string().default('USD'),
  rateType: z.enum(['FLAT', 'PER_MILE']).default('FLAT'),
  specialInstructions: z.string().optional(),
});

export type CreateLoadInput = z.infer<typeof createLoadSchema>;
