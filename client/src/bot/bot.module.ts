import { Module } from '@nestjs/common';
import { BotHandler } from './services/bot.handler';
import { OpenaiModule } from '../openai/openai.module';
import { config } from '../common/config';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule } from '@nestjs/microservices';
import { UserModule } from '../users/user.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  providers: [BotHandler],
  exports: [],
  imports: [
    OpenaiModule.registerAsync({
      useFactory: () => ({
        apiKey: config.get<string>('OPENAI_API_KEY'),
      }),
    }),
    ClientsModule,
    HttpModule,
    UserModule,
    PaymentModule,
  ],
  controllers: [],
})
export class BotModule {}
