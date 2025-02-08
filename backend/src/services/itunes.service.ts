import axios from 'axios'
import { ITunesApiResponse, ITunesResult, ITunesSearchParams } from './itunes.types'
import { AppError } from "@/utils/error-handler"
import { injectable, inject } from 'tsyringe'
import { Logger } from '@/utils/logger'

@injectable()
export class ITunesService {
  constructor(
    @inject(Logger) private logger: Logger
  ) { }

  private readonly BASE_URL = 'https://itunes.apple.com/search'
  private readonly TIMEOUT_SECONDS = 5
  private readonly RESULTS_LIMIT = 18

  async search(query: string): Promise<ITunesResult[]> {
    this.logger.info(`Searching for iTunes podcasts with query: ${query}`)

    const params: ITunesSearchParams = {
      term: query,
      media: 'podcast',
      entity: 'podcast',
      limit: this.RESULTS_LIMIT,
      explicit: 'No'
    }

    try {
      const response = await axios.get<ITunesApiResponse>(this.BASE_URL, {
        params,
        timeout: this.TIMEOUT_SECONDS * 1000
      })

      return response.data.results
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new AppError(
          error.response?.data?.message || 'iTunes API error',
          error.response?.status || 500,
          'ITUNES_API_ERROR'
        )
      }
      throw new AppError('Unexpected error occurred', 500, 'UNKNOWN_ERROR')
    }
  }
} 