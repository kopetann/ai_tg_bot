import { Ctx, Hears, Help, On, Start, Update } from 'nestjs-telegraf';

@Update()
export class BotHandler {
  @Start()
  async start(@Ctx() ctx) {
    await ctx.reply('Welcome');
  }

  @Help()
  async help(@Ctx() ctx) {
    await ctx.reply('Send me a sticker');
  }

  @On('sticker')
  async on(@Ctx() ctx) {
    await ctx.reply('👍');
  }

  @Hears('hi')
  async hears(@Ctx() ctx) {
    await ctx.reply('Hey there');
  }
}
