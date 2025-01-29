import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

type Constructor = { new (...args: unknown[]): unknown; schema?: ZodSchema };

export class ZodValidationPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    if (!value || !metadata.metatype) {
      return value;
    }

    const schema = this.getSchema(metadata.metatype);
    if (!schema) {
      return value;
    }

    try {
      return schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException(error.flatten());
      }
      throw error;
    }
  }

  private getSchema(metatype: Constructor): ZodSchema | null {
    return 'schema' in metatype ? (metatype.schema as ZodSchema) : null;
  }
}
