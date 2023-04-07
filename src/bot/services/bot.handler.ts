import {
  Action,
  Command,
  Ctx,
  InjectBot,
  On,
  Sender,
  Start,
  Update,
} from 'nestjs-telegraf';
import { User } from '../../common/decorators/user.decorator';
import { Markup, Telegraf } from 'telegraf';
import { OpenAiService } from '../../openai/services/openai.service';
import { UserService } from '../../users/services/user.service';
import { InternalServerErrorException } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import { join } from 'path';
import * as fs from 'fs';
import { Subject } from 'rxjs';

@Update()
export class BotHandler {
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly openAiService: OpenAiService,
    private readonly userService: UserService,
  ) {}

  @Start()
  public async start(
    @Ctx() ctx,
    @Sender('username') username: string,
    @User() user,
  ): Promise<void> {
    await ctx.reply(
      `Привет ${username}! Я бот ${ctx.botInfo.username}, приятно познакомиться`,
      Markup.inlineKeyboard([
        Markup.button.callback('Правила пользования', 'policy'),
        Markup.button.callback('Правила пользования', 'balance'),
        Markup.button.callback('Помощь', 'help'),
      ]),
    );
  }

  @Action('help')
  @Command('help')
  public async test(@Ctx() ctx, @User() user): Promise<void> {
    ctx.sendChatAction('typing');
    await ctx.reply(
      ` 
          <b>Этот бот уже умеет следующее:</b>
          <i>ChatGPT</i>
          <i>Voice-to-text</i>
          <i>Coming soon...</i>
     `,
      {
        parse_mode: 'HTML',
      },
    );
  }

  @Action('balance')
  public async balance(@Ctx() ctx): Promise<void> {
    ctx.sendChatAction('typing');
    const balance = await this.userService.getBalance('2');
    await ctx.reply(`Ваш баланс: ${balance}`);
  }

  @On('sticker')
  public async on(@Ctx() ctx): Promise<void> {
    await ctx.reply('👍');
  }

  @On('text')
  public async onMessage(@Ctx() ctx): Promise<void> {
    ctx.sendChatAction('typing');
    const response = await this.openAiService.makeChatRequest(ctx.message.text);
    await ctx.reply(response.data.choices[0].message.content);
  }

  @On('voice')
  public async onVoice(@Ctx() ctx): Promise<void> {
    try {
      ctx.sendChatAction('typing');
      const file = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
      this.transcryptAudio(file.href, ctx.message.from.id).subscribe((res) => {
        ctx.reply(res);
      });
    } catch (e) {
      console.error(e);
    }
  }

  private transcryptAudio(url: string, name: string) {
    const tempName = name + '_' + new Date().getMilliseconds() + '.mp3';
    const file = new Subject<string>();
    try {
      ffmpeg()
        .input(url)
        .toFormat('mp3')
        .on('error', (error) => console.log(`Encoding Error: ${error.message}`))
        .on('exit', () => console.log('Audio recorder exited'))
        .on('close', () => console.log('Audio recorder closed'))
        .on('end', () => {
          this.openAiService.transcribe(join('temp', tempName)).then((res) => {
            file.next(res.data);
            fs.unlinkSync(join('temp', tempName));
          });
        })
        .pipe(fs.createWriteStream(join('temp', tempName)));
      return file;
    } catch (e) {
      throw new InternalServerErrorException(`${e}`);
    }
  }

  // @Hears('Привет')
  // public async hears(@Ctx() ctx): Promise<void> {
  //   await ctx.reply('Привет, как сам?');
  // }
}
