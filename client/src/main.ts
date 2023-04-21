import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { config } from './common/config';
import { GrpcExceptionFilter } from './common/filters/grpc.exception.filter';

(async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new GrpcExceptionFilter());

  const swaggerConfig: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('NestJS bot application')
    .setDescription('NestJS bot application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );
  SwaggerModule.setup('docs', app, document);
  app.useStaticAssets(join(__dirname, '..', 'temp'), {
    prefix: '/static',
  });
  await app.listen(config.get('APPLICATION_PORT') ?? 3002);
})();
