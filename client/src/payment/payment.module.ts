import { Module } from '@nestjs/common';
import { PaymentService } from './services/payment.service';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '../users/user.module';

@Module({
  imports: [HttpModule, UserModule],
  controllers: [],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
