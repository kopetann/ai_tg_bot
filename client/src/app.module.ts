import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from './common/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotModule } from './bot/bot.module';
import { OpenaiModule } from './openai/openai.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { UserModule } from './users/user.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegrafModule.forRootAsync({
      useFactory: () => ({
        token: config.get<string>('BOT_TOKEN'),
      }),
    }),
    OpenaiModule.registerAsync({
      useFactory: () => ({
        apiKey: config.get<string>('OPENAI_API_KEY'),
      }),
    }),
    BotModule,
    SubscriptionModule,
    UserModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
