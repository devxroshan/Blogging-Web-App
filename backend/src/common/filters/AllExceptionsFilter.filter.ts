import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Utils
import { Environment } from '../utils/types';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception.getStatus();
    const errorRes = exception.getResponse();

    const error = errorRes as {
      name?: string;
      code?: string;
      msg?: string;
      details?: any;
    };

    if(error.code == 'INTERNAL_SERVER_ERROR' && this.configService.get<string>('NODE_ENV') == Environment.DEV) {
      console.error('Internal Server Error:', exception);
    }

    response.status(status).json({
      ok: false,
      statusCode: status,
      code: error.code || "UNKNOWN_ERROR",
      timestamp: new Date().toISOString(),
      path: request.url,
      error: {
        msg: error.msg || "Something went wrong. Try again later.",
        details: error.details || {},
      },
    });
  }
}
