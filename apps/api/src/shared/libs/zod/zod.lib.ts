import { z } from 'zod';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

function createApiPropertyDecoratorFromZod<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
) {
  return function <C extends { new (value: z.infer<z.ZodObject<T>>): object }>(
    target: C
  ): C {
    const zodShape = schema.shape;

    for (const [key, value] of Object.entries(zodShape)) {
      if (value instanceof z.ZodType) {
        const options = getApiPropertyOptions(value, key);
        ApiProperty(options)(target.prototype, key);
      }
    }

    return target;
  };
}

function getApiPropertyOptions(
  zodSchema: z.ZodTypeAny,
  propertyKey: string
): ApiPropertyOptions {
  const options: ApiPropertyOptions = {};

  if ('meta' in zodSchema._def) {
    const meta = zodSchema._def.meta;
    if ('description' in meta) options.description = meta.description;
    if ('example' in meta) options.example = meta.example;
  }

  if (zodSchema instanceof z.ZodString) {
    options.type = 'string';
    if (zodSchema.minLength !== null) options.minLength = zodSchema.minLength;
    if (zodSchema.maxLength !== null) options.maxLength = zodSchema.maxLength;
  } else if (zodSchema instanceof z.ZodNumber) {
    options.type = 'number';
    if (zodSchema.minValue !== null) options.minimum = zodSchema.minValue;
    if (zodSchema.maxValue !== null) options.maximum = zodSchema.maxValue;
  } else if (zodSchema instanceof z.ZodBoolean) {
    options.type = 'boolean';
  } else if (zodSchema instanceof z.ZodEnum) {
    options.enum = zodSchema.options;
    options.type = 'string';
  } else if (zodSchema instanceof z.ZodNativeEnum) {
    options.enum = Object.values(zodSchema.enum);
    options.type = 'string';
  } else if (zodSchema instanceof z.ZodDefault) {
    return {
      ...getApiPropertyOptions(zodSchema._def.innerType, propertyKey),
      default: zodSchema._def.defaultValue(),
    };
  } else if (zodSchema instanceof z.ZodEffects) {
    return getApiPropertyOptions(zodSchema._def.schema, propertyKey);
  }

  options.required = !zodSchema.isOptional();

  return options;
}

interface ZSchemaInterface<T extends z.ZodRawShape, TObject = z.ZodObject<T>> {
  new (data: z.infer<z.ZodObject<T>>): z.infer<z.ZodObject<T>>;
  schema: TObject;
  parse<
    TFinal extends new (data: z.infer<z.ZodObject<T>>) => InstanceType<TFinal>
  >(
    this: TFinal,
    value: z.infer<z.ZodObject<T>>
  ): InstanceType<TFinal>;
}

export function ZSchema<
  T extends z.ZodRawShape,
  Type = ZSchemaInterface<T> & z.infer<z.ZodObject<T>>
>(schema: z.ZodObject<T>): Type {
  @createApiPropertyDecoratorFromZod(schema)
  class ZodSchemaClass {
    static schema = schema;

    constructor(value: z.infer<z.ZodObject<T>>) {
      Object.assign(this, schema.parse(value));
    }

    static parse<T extends typeof ZodSchemaClass>(
      this: T,
      value: unknown
    ): Type {
      const parsed = new this(schema.parse(value)) as Type;
      return parsed;
    }
  }

  return ZodSchemaClass as Type;
}
