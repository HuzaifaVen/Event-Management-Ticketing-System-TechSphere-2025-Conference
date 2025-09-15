import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

dotenv.config();

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });

  const config = new DocumentBuilder()
    .setTitle('Event Management Website')
    .setDescription('Website for online tickets booking!')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // ✅ Write Swagger JSON to file
  writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));

  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // ✅ Serve static files from /uploads folder
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
