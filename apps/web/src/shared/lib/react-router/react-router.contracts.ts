import { z } from 'zod';

export const CollectionPageParamsSchema = z.object({
  collectionId: z.string(),
});
