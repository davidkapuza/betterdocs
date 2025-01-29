import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

export const ZodSerializerKey = 'ZOD_SERIALIZER_DTO_OPTIONS' as const;

@Injectable()
export class ZodSerializerInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const schema = this.reflector.getAllAndOverride(ZodSerializerKey, [
      context.getHandler(),
      context.getClass(),
    ]);

    return next.handle().pipe(
      map((res: object | object[]) => {
        if (!schema) return res;
        if (typeof res !== 'object' || res instanceof StreamableFile)
          return res;

        return Array.isArray(res)
          ? // TODO generate custom exception for zod validation and handle it with exception filter
            res.map((item) => schema.parse(item))
          : schema.parse(res);
      })
    );
  }
}
