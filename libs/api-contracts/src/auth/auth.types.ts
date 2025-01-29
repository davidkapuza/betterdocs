import { z } from 'zod';
import { SignUpDtoSchema } from './auth.schemas';

export type SignUpDto = z.infer<typeof SignUpDtoSchema>;
