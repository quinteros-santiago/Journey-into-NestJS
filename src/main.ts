import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  await app.startAllMicroservices();
  await app.listen(3000);

  process.on('SIGINT', function () {
    app.close();
  });
}
bootstrap();
