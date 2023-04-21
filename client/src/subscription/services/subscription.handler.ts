import { InjectBot, Update } from 'nestjs-telegraf';
import { UseFilters, UseGuards } from '@nestjs/common';
import { BotsGuard } from '../../common/guards/bots.guard';
import { TelegrafExceptionFilter } from '../../common/filters/telegraf.exception.filter';
import { Telegraf } from 'telegraf';
import { UserService } from '../../users/services/user.service';

@Update()
@UseFilters(TelegrafExceptionFilter)
@UseGuards(BotsGuard)
export class SubscriptionHandler {
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly userService: UserService,
  ) {}
}
