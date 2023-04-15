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
          url: config.get('SUBSCRIPTION_MICROSERVICE_URL', '0.0.0.0:50051'),
          protoPath: join(
            __dirname,
            '..',
            'common',
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
