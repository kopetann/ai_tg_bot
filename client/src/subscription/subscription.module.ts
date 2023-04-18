import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SubscriptionService } from './services/subscription.serivce';
import { config } from '../common/config';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SUBSCRIPTION_SERVICE',
        transport: Transport.GRPC,
        options: {
          url: config.get<string>(
            'SUBSCRIPTION_MICROSERVICE_URL',
            'backend_subscription:50051',
          ),
          protoPath: join(
            __dirname,
            '..',
            'proto',
            'subscription_service.proto',
          ),
          package: 'subscription_service',
        },
      },
    ]),
  ],
  controllers: [],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
