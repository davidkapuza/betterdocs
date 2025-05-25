import { z } from 'zod';
import { DocumentPageParamsSchema } from './react-router.contracts';

export type DocumentPageParams = z.infer<typeof DocumentPageParamsSchema>;
