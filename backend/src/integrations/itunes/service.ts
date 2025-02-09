import axios, { AxiosError } from 'axios'
import { injectable, inject } from 'tsyringe'
import { ITunesApiResponse, ITunesResult, ITunesSearchParams } from './types'
import { AppError, ErrorCode } from '@/utils/error-handler'
import { Logger } from '@/utils/logger'
import { config } from '@/config/env.config'
import { withRetry } from '@/utils/retry'

@injectable()
export class ITunesService {
	private readonly retryOptions = {
		maxAttempts: 3,
		delayMs: 1000,
		backoff: true,
		shouldRetry: (error: unknown) => {
			if (error instanceof AxiosError) {
				// Retry on network errors or 5xx server errors
				return (
					error.code === 'ECONNABORTED' ||
					error.code === 'ETIMEDOUT' ||
					(error.response?.status ?? 0) >= 500
				)
			}
			return false
		}
	}

	constructor(@inject(Logger) private logger: Logger) {}

	async searchPodcasts(query: string): Promise<ITunesResult[]> {
		const params: ITunesSearchParams = {
			term: query,
			media: 'podcast',
			entity: 'podcast',
			attribute: 'titleTerm',
			limit: 30
		}

		return this.makeRequest(params)
	}

	async searchEpisodes(query: string): Promise<ITunesResult[]> {
		const params: ITunesSearchParams = {
			term: query,
			media: 'podcast',
			entity: 'podcastEpisode',
			attribute: 'titleTerm',
			limit: 18
		}

		return this.makeRequest(params)
	}

	private async makeRequest(params: ITunesSearchParams): Promise<ITunesResult[]> {
		try {
			const response = await withRetry(
				() => axios.get<ITunesApiResponse>(config.env.ITUNES_API_URL, { params }),
				this.retryOptions
			)

			return response.data.results
		} catch (error) {
			if (error instanceof AxiosError) {
				throw new AppError(
					'Failed to fetch data from iTunes API',
					error.response?.status || 500,
					ErrorCode.SERVICE_UNAVAILABLE
				)
			}

			throw error
		}
	}
}
