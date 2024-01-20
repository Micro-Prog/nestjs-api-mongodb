import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // use the validation pipe
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3333);
}
bootstrap();
