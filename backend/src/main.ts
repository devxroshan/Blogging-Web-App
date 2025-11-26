import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './common/filters/AllExceptionsFilter.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,

      exceptionFactory: (errors) => {
        const details = errors.map((err) => ({
          field: err.property,
          errors: Object.values(err.constraints || {}),
        }));

        return new BadRequestException({
          msg: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details,
        })
      },
    }),
  );

  app.use(helmet());
  app.useGlobalFilters(new AllExceptionsFilter(configService));

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
