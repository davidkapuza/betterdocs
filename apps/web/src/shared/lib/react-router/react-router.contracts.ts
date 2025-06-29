import { z } from 'zod';

export const DocumentsPageParamsSchema = z.object({
  collectionId: z.string(),
});
