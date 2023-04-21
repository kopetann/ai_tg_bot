import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [forwardRef(() => SubscriptionModule)],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
