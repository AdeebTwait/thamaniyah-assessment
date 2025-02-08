import { injectable, inject } from 'tsyringe'
import { SearchRepository } from '@/repositories/search.repository'
import { ITunesService } from './itunes.service'
import { SearchResponse, ITunesResult } from '@/types'
import { AppError } from "@/utils/error-handler"
import { Logger } from '@/utils/logger'

@injectable()
export class SearchService {
  constructor(
    @inject(SearchRepository) private searchRepository: SearchRepository,
    @inject(ITunesService) private itunesService: ITunesService,
    @inject(Logger) private logger: Logger
  ) {}

  async search(query: string): Promise<SearchResponse> {
    try {
      this.logger.info({ query }, 'Searching for query')

      const cachedResults = await this.findCachedResults(query)
      if (cachedResults) {
        this.logger.info({
          resultCount: cachedResults.length,
        }, 'Found cached results')
        
        return {
          results: cachedResults,
          resultCount: cachedResults.length,
          fromCache: true
        }
      }

      const results = await this.itunesService.search(query)
      await this.cacheResults(query, results)

      return {
        results,
        resultCount: results.length,
        fromCache: false
      }
    } catch (error) {
      this.logger.error({ error }, 'Search failed')
      throw new AppError(
        error instanceof Error ? error.message : 'Search failed',
        500
      )
    }
  }

  private async findCachedResults(query: string): Promise<ITunesResult[] | null> {
    const cachedResult = await this.searchRepository.findOne(query)
    
    if (!cachedResult) {
      return null
    }

    return JSON.parse(cachedResult.results) as ITunesResult[]
  }

  private async cacheResults(query: string, results: ITunesResult[]): Promise<void> {
    try {
      const serializedResults = JSON.stringify(results)

      this.logger.info({
        query,
        resultCount: results.length,
      }, 'Caching results')

      await this.searchRepository.create({
        query,
        results: serializedResults
      })
    } catch (error) {
      this.logger.error({ error, query }, 'Failed to cache results')
    }
  }
} 