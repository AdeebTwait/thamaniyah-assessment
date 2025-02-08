import { injectable } from 'tsyringe';
import pino from 'pino'
import { config } from '@/config/env.config'
import { RequestContext } from './context'

@injectable()
export class Logger {
  private logger: pino.Logger

  constructor() {
    this.logger = pino({
      level: config.env.LOG_LEVEL,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true
        }
      },
      mixin() {
        return {
          interaction_id: RequestContext.getInteractionId()
        }
      }
    })
  }

  info(obj: object | string, msg?: string): void {
    if (typeof obj === 'string') {
      this.logger.info({ msg: obj })
    } else {
      this.logger.info(obj, msg)
    }
  }

  error(obj: object | string, msg?: string): void {
    if (typeof obj === 'string') {
      this.logger.error({ msg: obj })
    } else {
      this.logger.error(obj, msg)
    }
  }

  warn(obj: object | string, msg?: string): void {
    if (typeof obj === 'string') {
      this.logger.warn({ msg: obj })
    } else {
      this.logger.warn(obj, msg)
    }
  }

  debug(obj: object | string, msg?: string): void {
    if (typeof obj === 'string') {
      this.logger.debug({ msg: obj })
    } else {
      this.logger.debug(obj, msg)
    }
  }
} 