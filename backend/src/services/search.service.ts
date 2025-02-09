import { injectable, inject } from 'tsyringe'
import { SearchRepository } from '@/repositories/search.repository'
import { ITunesService } from '@/integrations/itunes/service'
import { SearchResponse } from '@/types'
import { Logger } from '@/utils/logger'
import { sanitizeQuery } from '@/utils/sanitize'

@injectable()
export class SearchService {
	constructor(
		@inject(SearchRepository) private searchRepository: SearchRepository,
		@inject(ITunesService) private itunesService: ITunesService,
		@inject(Logger) private logger: Logger
	) {}

	async search(query: string): Promise<SearchResponse> {
		try {
			const sanitizedQuery = sanitizeQuery(query)

			// Try to get cached results first
			const cachedResults = await this.findCachedResults(sanitizedQuery)
			if (cachedResults) {
				return cachedResults
			}

			// If no cache, fetch from iTunes
			const [podcasts, episodes] = await Promise.all([
				this.itunesService.searchPodcasts(sanitizedQuery),
				this.itunesService.searchEpisodes(sanitizedQuery)
			])

			const results: SearchResponse = {
				podcasts,
				episodes,
				resultCount: podcasts.length + episodes.length
			}

			// Cache the results
			await this.cacheResults(sanitizedQuery, results)

			return results
		} catch (error) {
			this.logger.error({ error }, 'Search failed')
			throw error
		}
	}

	private async findCachedResults(query: string): Promise<SearchResponse | null> {
		const cachedResult = await this.searchRepository.findOne(query)
		return cachedResult ? (JSON.parse(cachedResult.results) as SearchResponse) : null
	}

	private async cacheResults(query: string, results: SearchResponse): Promise<void> {
		try {
			const serializedResults = JSON.stringify(results)
			await this.searchRepository.create({
				query,
				results: serializedResults
			})
		} catch (error) {
			this.logger.error({ error }, 'Failed to cache results')
		}
	}
}
