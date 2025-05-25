import { z } from 'zod';

export const DocumentPageParamsSchema = z.object({
  collectionId: z.string(),
  documentId: z.string(),
});
