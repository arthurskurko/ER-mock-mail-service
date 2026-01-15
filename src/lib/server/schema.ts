import { z } from 'zod';

const RecipientSchema = z.object({
  emailAddress: z.object({
    address: z.string().email(),
    name: z.string().optional()
  })
});

const BodySchema = z.object({
  contentType: z.enum(['Text', 'HTML']).default('Text'),
  content: z.string().min(1)
});

export const SendMailSchema = z.object({
  message: z.object({
    subject: z.string().optional().default(''),
    body: BodySchema.optional(),
    toRecipients: z.array(RecipientSchema).min(1),
    ccRecipients: z.array(RecipientSchema).optional(),
    bccRecipients: z.array(RecipientSchema).optional(),
    clientMessageId: z.string().optional()
  }),
  saveToSentItems: z.boolean().optional().default(true)
});

export type SendMailRequest = z.infer<typeof SendMailSchema>;
