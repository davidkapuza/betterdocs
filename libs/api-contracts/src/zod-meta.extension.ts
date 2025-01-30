import { ZodType, ZodTypeDef } from 'zod';

declare module 'zod' {
  interface ZodType {
    meta(meta: Record<string, unknown>): this;
  }
}

// Expadning zod with metadata for OpenApi schema generation
ZodType.prototype.meta = function (meta: Record<string, unknown>) {
  const This = this.constructor as new (def: ZodTypeDef) => ZodType<
    unknown,
    ZodTypeDef,
    unknown
  >;
  return new This({
    ...this._def,
    meta,
  });
};
