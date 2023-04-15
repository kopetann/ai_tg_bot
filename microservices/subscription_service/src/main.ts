import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './common/config';

(async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice(
    AppModule,
    config.getGrpcOptions(),
  );

  await app.listen().then((res) => {
    console.log('Microservice is listening');
  });
})();
