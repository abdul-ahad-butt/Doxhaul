import { z } from 'zod';

export const documentUploadSchema = z.object({
  documentType: z.enum(['DOT_CERTIFICATE', 'MC_CERTIFICATE', 'INSURANCE_CERTIFICATE', 'DRIVER_LICENSE', 'W9', 'BUSINESS_LICENSE', 'OTHER']),
});
