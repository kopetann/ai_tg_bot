import {
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
} from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import { join } from 'path';
import * as fs from 'fs';
import { catchError, Observable, of, Subject, switchMap } from 'rxjs';
import { UserService } from '../../users/services/user.service';
import { BotsGuard } from '../../common/guards/bots.guard';
import { TelegrafExceptionFilter } from '../../common/filters/telegraf.exception.filter';
import { UserHasLimitGuard } from '../../common/guards/user.has.limit.guard';
import { Utils } from '../../common/utils';
import { PaymentService } from '../../payment/services/payment.service';
import { PaymentResponseInterface } from '../../payment/interfaces/payment.response.interface';
import { User } from '../../proto/build/user.pb';

@Update()
@UseGuards(BotsGuard)
@UseFilters(TelegrafExceptionFilter)
export class BotHandler {
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly openAiService: OpenAiService,
    private readonly userService: UserService,
    private readonly paymentService: PaymentService,
  ) {}

  @Start()
  public async start(
    @Ctx() ctx,
    @Sender('username') username: string,
    @Sender('first_name') firstName: string,
  ): Promise<void> {
    const template =
      `Привет, ${username ?? firstName.trim()}! 😃` +
      '\n' +
      ' Я твой универсальный помощник на основе ChatGPT 🌟\n' +
      '\n' +
      ' Спроси меня о чем хочешь, я знаю все, например:\n' +
      '\n' +
      '🗣 Расскажи анекдот или историю\n' +
      '📝 Помоги в решении домашнего задания\n' +
      '🍲 Спланируй мне рацион для похудения\n' +
      '🚗 Предложи классный маршрут для путешествия\n' +
      '\n' +
      ' И многое другое. Поехали 😉';

    await ctx.reply(template, {
      parse_mode: 'HTML',
      ...Markup.keyboard([['Подписка'], ['Поддержка']]),
    });
  }

  @Hears(['Подписка'])
  public sendSubs(@Ctx() ctx: Context) {
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
            return of(
              ctx.reply(
                `Количество запросов ко мне: ${user.freeRequests}\nДля безграничного общения со мной, пожалуйста, оформи подписку 👍`,
                this.userService.getSubscriptionKeyboard(),
              ),
            );
          }
          return of(
            ctx.reply(
              `Количество запросов ко мне: без ограничений\nДата окончания: ${new Date(
                parseInt(user.subscriptionDate),
              )}`,
              this.userService.getSubscriptionKeyboard(),
            ),
          );
        }),
      );
  }

  @Hears(['Неделя - 169 руб', 'Месяц - 359 руб'])
  public activateSubs(
    @Ctx() ctx: Context,
    @Sender('id') extId: number,
    @Sender('username') userName: string,
    @Sender('first_name') name: string,
  ) {
    this.paymentService
      .createPayment({
        amount: {
          value: '169',
          currency: 'RUB',
        },
        metadata: {
          user_id: extId,
          date: Utils.dateWithOffsetDays(7).getTime(),
          name: name,
          userName: userName ?? '',
        },
      })
      .pipe(
        catchError((err: Record<string, any>) => {
          console.error(err.response.data.description);
          return of();
        }),
      )
      .subscribe((res: PaymentResponseInterface) => {
        this.paymentService.checkForStatusUpdate(res.id);
        ctx.reply(
          `Пожалуйста, перейдите по ссылке:\n${res.confirmation.confirmation_url}`,
          {
            parse_mode: 'HTML',
          },
        );
      });
  }

  @On('sticker')
  public async on(@Ctx() ctx): Promise<void> {
    await ctx.reply('👍');
  }

  @On('text')
  @UseGuards(UserHasLimitGuard)
  public async onMessage(@Ctx() ctx: Context): Promise<void> {
    const { from } = ctx;
    await ctx.sendChatAction('typing');
    return this.openAiService
      .makeChatRequest(ctx.message['text'])
      .then((res) => {
        this.userService.removeFreeRequest(ctx.from.id).subscribe();
        ctx.reply(res.data.choices[0].message.content);
      });
  }

  @On('voice')
  @UseGuards(UserHasLimitGuard)
  public async onVoice(@Ctx() ctx): Promise<void> {
    try {
      ctx.sendChatAction('typing');
      const file = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
      this.transcryptAudio(file.href, ctx.message.from.id).subscribe(
        async (res: string): Promise<void> => {
          const response = await this.openAiService.makeChatRequest(res);
          this.userService.removeFreeRequest(ctx.from.id).subscribe();
          ctx.reply(response.data.choices[0].message.content);
        },
      );
    } catch (e) {
      console.error(e);
      ctx.reply('Извините, что-то сломалось');
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
        .on('exit', () => console.log('Audio recorder exited'))
        .on('close', () => console.log('Audio recorder closed'))
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
