import { ArgumentsHost } from '@nestjs/common';
import { TelegrafArgumentsHost } from 'nestjs-telegraf';
import { Context } from 'telegraf';

export class TelegrafExceptionFilter implements TelegrafExceptionFilter {
  async catch(exception: Error, host: ArgumentsHost): Promise<void> {
    const telegrafArgumentHost = TelegrafArgumentsHost.create(host);
    console.log(exception);
    const ctx = telegrafArgumentHost.getContext<Context>();
    return;
  }
}
