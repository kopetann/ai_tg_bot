import {
  Action,
  Ctx,
  Hears,
  InjectBot,
  On,
  Sender,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Context, Markup, Telegraf } from 'telegraf';
import { OpenAiService } from '../../openai/services/openai.service';
import {
  InternalServerErrorException,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import { join } from 'path';
import * as fs from 'fs';
import { catchError, Observable, of, Subject, switchMap } from 'rxjs';
import { UserService } from '../../users/services/user.service';
import { UserHasLimitGuard } from '../../common/guards/user.has.limit.guard';
import { Utils } from '../../common/utils';
import { PaymentService } from '../../payment/services/payment.service';
import { PaymentResponseInterface } from '../../payment/interfaces/payment.response.interface';
import { User } from 'ai_tg_bot_proto';
import { TelegrafExceptionFilter } from '../../common/filters/telegraf.exception.filter';
import { BotsGuard } from '../../common/guards/bots.guard';
import { SubscriptionInterface } from '../interfaces/subscription.interface';
import { RedisService } from '../../redis/redis.service';
import { Roles, RolesInterface } from '../../common/interfaces/roles.interface';
import { IsBotBlockedInterceptor } from '../../common/interceptors/is.bot.blocked.interceptor';

@Update()
@UseInterceptors(IsBotBlockedInterceptor)
@UseGuards(BotsGuard)
@UseFilters(TelegrafExceptionFilter)
export class BotHandler {
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly openAiService: OpenAiService,
    private readonly userService: UserService,
    private readonly paymentService: PaymentService,
    private readonly redisService: RedisService,
  ) {}

  @Start()
  public async start(
    @Ctx() ctx,
    @Sender('username') username: string,
    @Sender('first_name') firstName: string,
  ) {
    try {
      const template =
        `Привет, ${username ?? firstName.trim()}! 😃` +
        '\n\n' +
        'Я твой универсальный помощник на основе ChatGPT 4 🌟\n' +
        '\n' +
        'Спроси меня о чем хочешь, я знаю все, например:\n' +
        '\n' +
        '🗣 Расскажи анекдот или историю\n' +
        '📝 Помоги в решении домашнего задания\n' +
        '🍲 Спланируй мне рацион для похудения\n' +
        '🚗 Предложи классный маршрут для путешествия\n' +
        '\n' +
        'И многое другое. Поехали 😉';

      ctx.reply(template, {
        parse_mode: 'HTML',
        ...this.userService.getCommonKeyboard(),
      });
    } catch (err) {
      console.error(err);
    }
  }

  @Action(['week', 'month'])
  @Hears(['Неделя - 169 руб', 'Месяц - 359 руб'])
  public getSubscriptionInfo(
    @Ctx() ctx: Record<string, any>,
    @Sender('id') extId: number,
    @Sender('username') userName: string,
    @Sender('first_name') name: string,
  ) {
    const subscription: SubscriptionInterface = {
      word: 'неделю',
      price: '169',
      time: ctx.callbackQuery.data,
      duration: 7,
    };

    if (ctx.callbackQuery.data === 'month') {
      subscription.word = 'месяц';
      subscription.price = '369';
      subscription.duration = 30;
    }

    const template = `Подписка на ${subscription.word} общения с ассистентом 🙂\nВходит:\n🌟Неограниченное количество вопросов\n⏳Доступ к общению 24/7\n🧑‍💻Технически поддержу тебя\n💸Удобная оплата`;

    try {
      this.paymentService
        .createPayment({
          amount: {
            value: subscription.price,
            currency: 'RUB',
          },
          metadata: {
            user_id: extId,
            date: Utils.dateWithOffsetDays(subscription.duration).getTime(),
            name,
            userName: userName ?? '',
          },
        })
        .pipe(
          catchError((err: Record<string, any>) => {
            ctx.reply(`${err}`, this.userService.getCommonKeyboard());
            return of();
          }),
        )
        .subscribe((res: PaymentResponseInterface) => {
          this.paymentService.checkForStatusUpdate(res.id);
          ctx.reply(
            template,
            Markup.inlineKeyboard([
              [
                Markup.button.url(
                  `Оплатить подписку - ${subscription.price} руб`,
                  res.confirmation.confirmation_url,
                ),
              ],
            ]),
          );
        });
    } catch (e) {
      console.error(e);
    }
  }

  @Hears(['Подписка'])
  @Action('subscription')
  public sendSubs(@Ctx() ctx: Context) {
    try {
      return this.userService
        .getUser({
          extId: ctx.from.id,
          userName: ctx.from.username,
          name: ctx.from.first_name,
        })
        .pipe(
          switchMap((user: User) => {
            if (
              !user.subscriptionDate ||
              new Date(parseInt(user.subscriptionDate)) < new Date()
            ) {
              ctx.reply(
                `Количество запросов ко мне: ${user.freeRequests}\nДля безграничного общения со мной, пожалуйста, оформи подписку 👍`,
                this.userService.getSubscriptionKeyboard(),
              );
              return of(0);
            }
            ctx.reply(
              `Количество запросов ко мне: без ограничений\nДата окончания: ${Utils.getFullDate(
                user.subscriptionDate,
              )}`,
              this.userService.getCommonKeyboard(),
            );
            return of(0);
          }),
        );
    } catch (e) {
      console.error(e);
    }
  }

  @On('sticker')
  public async on(@Ctx() ctx): Promise<void> {
    await ctx.reply('👍');
  }

  @On('text')
  @UseGuards(UserHasLimitGuard)
  public async onMessage(@Ctx() ctx: Context): Promise<void> {
    ctx.sendChatAction('typing');
    const history: RolesInterface[] = await this.addToHistoryAndReturn(
      ctx.from.id,
      ctx.message['text'],
    );

    try {
      await this.openAiService.makeChatRequest(history);
      return this.openAiService.makeChatRequest(history).then(async (res) => {
        this.userService.removeFreeRequest(ctx.from.id).subscribe();

        await this.addToHistoryAndReturn(
          ctx.from.id,
          '',
          res.choices[0].message.content,
        );

        await ctx.reply(res.choices[0].message.content);
      });
    } catch (e) {
      console.error(e);
    }
  }

  @On('voice')
  @UseGuards(UserHasLimitGuard)
  public async onVoice(@Ctx() ctx): Promise<void> {
    try {
      ctx.sendChatAction('typing');
      const file = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
      this.transcryptAudio(file.href, ctx.message.from.id).subscribe(
        async (res: string): Promise<void> => {
          const history: RolesInterface[] = await this.addToHistoryAndReturn(
            ctx.from.id,
            res,
          );
          const response = await this.openAiService.makeChatRequest(history);
          this.userService.removeFreeRequest(ctx.from.id).subscribe();
          ctx.reply(response.choices[0].message.content);
        },
      );
    } catch (e) {
      console.error('Error', e);
    }
  }

  private resetUserHistory(userId: number): Promise<void> {
    return this.redisService.del(userId.toString());
  }

  private async addToHistoryAndReturn(
    userId: number,
    userMessage?: string,
    botAnswer?: string,
  ): Promise<RolesInterface[]> {
    try {
      let history: RolesInterface[] = await this.redisService.get<
        RolesInterface[]
      >(userId.toString());

      if (!history) history = [];

      const content: RolesInterface = { content: '', role: undefined };

      if (
        (!history.length || history[history.length - 1].role === 'user') &&
        botAnswer
      ) {
        content.role = <Roles>'system';
        content.content = botAnswer;
      } else if (
        (!history.length || history[history.length - 1]?.role === 'system') &&
        userMessage
      ) {
        content.role = <Roles>'user';
        content.content = userMessage;
      } else {
        return history;
      }
      history.push(content);
      await this.redisService.set(userId.toString(), history);
      return history;
    } catch (e) {
      console.error(e);
    }
  }

  private transcryptAudio(url: string, name: string): Observable<string> {
    const tempName: string = name + '_' + new Date().getMilliseconds() + '.mp3';
    const file: Subject<string> = new Subject<string>();
    try {
      ffmpeg()
        .input(url)
        .toFormat('mp3')
        .on('error', (error) => console.log(`Encoding Error: ${error.message}`))
        .on('end', () => {
          this.openAiService
            .transcribe(join('temp', tempName))
            .then((res): void => {
              file.next(res);
              fs.unlinkSync(join('temp', tempName));
            });
        })
        .pipe(fs.createWriteStream(join('temp', tempName)));
      return file;
    } catch (e) {
      throw new InternalServerErrorException(`${e}`);
    }
  }
}
