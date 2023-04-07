import { Module } from '@nestjs/common';
import { BotHandler } from './services/bot.handler';
import { OpenaiModule } from '../openai/openai.module';
import { Config } from '../common/config';
import { UserModule } from '../users/user.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [BotHandler],
  exports: [],
  imports: [
    OpenaiModule.registerAsync({
      useFactory: () => ({
        apiKey: new Config().get('OPENAI_API_KEY'),
      }),
    }),
    UserModule,
    HttpModule,
  ],
  controllers: [],
})
export class BotModule {}
