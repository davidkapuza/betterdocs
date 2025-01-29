import { ZodSchema, ZodTypeDef } from 'zod';
import { ZodDto } from './zod.types';

export function createDtoFromZod<
  Output,
  Def extends ZodTypeDef = ZodTypeDef,
  Input = Output
>(schema: ZodSchema<Output, Def, Input>) {
  class AugmentedZodDto {
    public static schema = schema;

    public static create(value: unknown): Output {
      return this.schema.parse(value);
    }
  }

  return AugmentedZodDto as ZodDto<Output, Def, Input>;
}
