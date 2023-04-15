import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class SubscriptionService {
  @GrpcMethod()
  public getUser(): void {
    console.log('Hello World!');
  }
}
