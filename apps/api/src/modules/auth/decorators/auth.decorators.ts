import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const ReqUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(ctx).getContext();

    return gqlContext.req.user ?? gqlContext.req.extra.user;
  }
);
