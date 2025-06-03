import { z } from 'zod';

export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
};

// Form schema
export const issuanceSchema = z.object({
  customerEmail: z.string().email('Invalid email address'),
  category: z.enum(['Shizuka', 'Kaori']),
  experience: z.string().min(3, 'Experience must be at least 3 characters'),
});

export type IssuanceFormData = z.infer<typeof issuanceSchema>;