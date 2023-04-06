import {
  Action,
  Command,
  Context,
  Ctx,
  Hears,
  Help,
  InjectBot,
  On,
  Sender,
  Start,
  Update,
} from 'nestjs-telegraf';
import { User } from '../../common/decorators/user.decorator';
import { Telegraf } from 'telegraf';
import { OpenAiService } from '../../openai/services/openai.service';

@Update()
export class BotHandler {
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly openAiService: OpenAiService,
  ) {}

  @Start()
  public async start(
    @Ctx() ctx,
    @Sender('username') username: string,
    @User() user,
  ) {
    await ctx.reply(
      `Привет ${username}! Я бот ${ctx.botInfo.username}, приятно познакомиться`,
    );
  }

  @Action('test')
  public async sendTest(@Ctx() ctx) {
    ctx.reply('Тестовое сообщение');
  }

  @Command('test')
  public async test(@Ctx() ctx) {
    await ctx.reply('Тестовое сообщение');
  }

  @Help()
  public async help(@Ctx() ctx) {
    await ctx.reply('Send me a sticker');
  }

  @On('sticker')
  public async on(@Ctx() ctx) {
    await ctx.reply('👍');
  }

  @On('message')
  public async onMessage(
    @Ctx() ctx,
    @Context() context: typeof Context,
  ): Promise<void> {
    const response = await this.openAiService.makeChatRequest(ctx.message.text);
    await ctx.reply(response.data.choices[0].message.content);
  }

  @Hears('Привет')
  public async hears(@Ctx() ctx) {
    await ctx.reply('Hey there');
  }
}
