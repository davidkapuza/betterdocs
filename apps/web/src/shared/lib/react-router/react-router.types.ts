import { z } from 'zod';
import { DocumentsPageParamsSchema } from './react-router.contracts';

export type DocumentsPageParams = z.infer<typeof DocumentsPageParamsSchema>;
