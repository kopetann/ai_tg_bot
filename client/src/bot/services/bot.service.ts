import { Injectable } from '@nestjs/common';
import { BotHandler } from './bot.handler';

@Injectable()
export class BotService {
  constructor(private readonly botHandler: BotHandler) {}
}
