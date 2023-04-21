import { Telegraf } from 'telegraf';
import { config } from '../../common/config';

export function CallbackQueryDecorator() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const telegraf = new Telegraf(config.get<string>('BOT_TOKEN')).on(
      'callback_query',
      async (ctx) => {
        console.log(123);
      },
    );
  };
}
