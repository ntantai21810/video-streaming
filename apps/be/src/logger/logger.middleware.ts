import { Inject, Injectable, NestMiddleware, Res } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  use(req: Request, @Res() res: Response, next: NextFunction) {
    const start = Date.now();
    const { ip, method, originalUrl } = req;

    this.logger.info(
      `[Request] ${method} ${originalUrl} ${JSON.stringify(
        req.body || {}
      )} ${JSON.stringify(req.headers || {})} ${ip}`
    );

    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - start;

      this.logger.info(
        `[Response] ${method} ${originalUrl} ${statusCode} ${
          (res as any)._header
        } ${ip} ${responseTime}ms`
      );
    });

    next();
  }
}
