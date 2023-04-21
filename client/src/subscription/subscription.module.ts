import { forwardRef, Module } from '@nestjs/common';
import { SubscriptionService } from './services/subscription.serivce';
import { ClientsModule, GrpcOptions, Transport } from '@nestjs/microservices';
import { config } from '../common/config';
import { join } from 'path';
import { SubscriptionHandler } from './services/subscription.handler';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'SUBSCRIPTION_SERVICE',
        useFactory: (): GrpcOptions => ({
          transport: Transport.GRPC,
          options: {
            url: config.get<string>(
              'SUBSCRIPTION_MICROSERVICE_URL',
              '127.0.0.1:50051',
            ),
            protoPath: join(
              __dirname,
              '..',
              'proto',
              'subscription_service.proto',
            ),
            package: 'subscription_service',
          },
        }),
      },
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [],
  providers: [SubscriptionService, SubscriptionHandler],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
