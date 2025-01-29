import { ZodSchema, ZodTypeDef } from 'zod';

export type ZodDto<
  Output = unknown,
  Def extends ZodTypeDef = ZodTypeDef,
  Input = Output
> = {
  new (): Output;
  schema: ZodSchema<Output, Def, Input>;
  create(input: unknown): Output;
};
