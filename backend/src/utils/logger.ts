import { injectable } from 'tsyringe'
import pino from 'pino'
import { config } from '@/config/env.config'
import { RequestContext } from '@/utils/context'

@injectable()
export class Logger {
	private logger: pino.Logger

	constructor() {
		// Create an async destination stream
		const destination = pino.destination({
			sync: false, // Enable async logging
			minLength: 4096, // Buffer before writing
			mkdir: true // Create directory if doesn't exist
		})

		// Handle process exit to flush logs
		process.on('beforeExit', () => {
			destination.flushSync()
		})

		this.logger = pino(
			{
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
			},
			destination
		)
	}

	async info(obj: object | string, msg?: string): Promise<void> {
		if (typeof obj === 'string') {
			await this.logger.info({ msg: obj })
		} else {
			await this.logger.info(obj, msg)
		}
	}

	async error(obj: object | string, msg?: string): Promise<void> {
		if (typeof obj === 'string') {
			await this.logger.error({ msg: obj })
		} else {
			await this.logger.error(obj, msg)
		}
	}

	async warn(obj: object | string, msg?: string): Promise<void> {
		if (typeof obj === 'string') {
			await this.logger.warn({ msg: obj })
		} else {
			await this.logger.warn(obj, msg)
		}
	}

	async debug(obj: object | string, msg?: string): Promise<void> {
		if (typeof obj === 'string') {
			await this.logger.debug({ msg: obj })
		} else {
			await this.logger.debug(obj, msg)
		}
	}
}
