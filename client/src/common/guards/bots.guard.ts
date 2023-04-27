import { CanActivate, ExecutionContext } from '@nestjs/common';
import { TelegrafArgumentsHost, TelegrafException } from 'nestjs-telegraf';
import { Context } from 'telegraf';

export class BotsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const telegrafArgumentHost: TelegrafArgumentsHost =
      TelegrafArgumentsHost.create(context);
    const ctx = telegrafArgumentHost.getContext<Context>();

    if (ctx.from.is_bot) {
      throw new TelegrafException(`You're bot!`);
    }

    return true;
  }
}
