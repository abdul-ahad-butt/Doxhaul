import { z } from 'zod';

export const documentUploadSchema = z.object({
  documentType: z.enum(['DOT_CERTIFICATE', 'MC_CERTIFICATE', 'INSURANCE_CERTIFICATE', 'DRIVER_LICENSE', 'W9', 'BUSINESS_LICENSE', 'POD', 'BOL', 'RATE_CONFIRMATION', 'OTHER']),
  loadId: z.string().optional(),
});
