import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './common/config';
import { ValidationPipe } from '@nestjs/common';

(async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice(
    AppModule,
    config.getGrpcOptions(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen().then((res) => {
    console.log('Microservice is listening');
  });
})();
