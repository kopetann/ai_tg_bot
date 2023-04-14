import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Config } from './common/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotModule } from './bot/bot.module';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegrafModule.forRootAsync({
      useFactory: () => ({
        token: new Config().get('BOT_TOKEN'),
      }),
    }),
    OpenaiModule.registerAsync({
      useFactory: () => ({
        apiKey: new Config().get('OPENAI_API_KEY'),
      }),
    }),
    BotModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
