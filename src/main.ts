import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Para hacer super estrictos con el backend. Para que solo acepte la info que mi back pide. Entonces cuando yo mando una propiedad que no existe en mi backend, va a tirar un error, de esta forma no pasan propiedades que no existen en mi back
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  await app.listen(3000);
}
bootstrap();
