import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UpdateInterface } from '../../bot/interfaces/update.interface';
import { TelegrafException } from 'nestjs-telegraf';

export class BotsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: UpdateInterface = context.switchToHttp().getRequest().update;
    if (request.message.from.is_bot) {
      throw new TelegrafException(`You're bot!`);
    }
    return true;
  }
}
