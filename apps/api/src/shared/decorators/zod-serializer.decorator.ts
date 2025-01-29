import { SetMetadata } from '@nestjs/common';
import { ZodSerializerKey } from '@shared/interceptors';
import { ZodDto } from '@shared/libs/zod';
import { ZodSchema } from 'zod';

export const ZodSerializer = (dto: ZodDto | ZodSchema) =>
  SetMetadata(ZodSerializerKey, dto);
