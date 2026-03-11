import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe — strips unrecognized properties and validates DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // Swagger / OpenAPI documentation at /api
  const config = new DocumentBuilder()
    .setTitle('Payments Service API')
    .setDescription(
      'Abstracted payments service with pluggable payment providers.\n\n' +
      '**Active provider:** Configured via `PAYMENT_PROVIDER` env variable (currently `nmi`).\n\n' +
      'Adding a new provider (e.g. Tilled) requires only a new adapter class — ' +
      'no changes to controllers or services.',
    )
    .setVersion('1.0')
    .addTag('Payments — Merchants', 'Generic merchant management endpoints backed by the configured payment provider')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`\n🚀 Payments Service POC is running on: http://localhost:${port}`);
  console.log(`📋 Swagger UI available at:            http://localhost:${port}/api`);
  console.log(`🔌 Active payment provider:            ${process.env.PAYMENT_PROVIDER ?? 'nmi'}\n`);
}

bootstrap();
