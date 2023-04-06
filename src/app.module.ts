import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Config } from './common/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { UserModule } from './users/user.module';
import { BotModule } from './bot/bot.module';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => new Config().getTypeOrmConfig(),
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
    UserModule,
    BotModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
