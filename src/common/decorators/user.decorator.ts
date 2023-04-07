import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';

export const User = createParamDecorator((__, ctx: ExecutionContext) => {
  const updateUser = TelegrafExecutionContext.create(ctx).getContext().from;
});
