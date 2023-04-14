import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { Config } from './common/config';

(async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS bot application')
    .setDescription('NestJS bot application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
  app.useStaticAssets(join(__dirname, '..', 'temp'), {
    prefix: '/static',
  });
  await app.listen(new Config().get('APPLICATION_PORT') ?? 3002);
})();
