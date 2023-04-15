import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { UserService } from './services/user.service';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  controllers: [],
  providers: [UserService],
  exports: [UserService],
  imports: [SubscriptionModule, ClientsModule],
})
export class UserModule {}
