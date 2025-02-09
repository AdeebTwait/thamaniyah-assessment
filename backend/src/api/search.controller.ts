import { injectable, inject } from 'tsyringe'
import { FastifyRequest, FastifyReply } from 'fastify'
import { SearchService } from '@/services/search.service'
import { Logger } from '@/utils/logger'
import { handleError, BadRequestError } from '@/utils/error-handler'
import { SearchQueryParams, SearchResponse } from '@/types'

@injectable()
export class SearchController {
	constructor(
		@inject(SearchService) private searchService: SearchService,
		@inject(Logger) private logger: Logger
	) {}

	search = async (
		request: FastifyRequest<{ Querystring: SearchQueryParams }>,
		reply: FastifyReply
	): Promise<SearchResponse> => {
		try {
			const { q: query } = request.query

			if (!query || query.trim().length === 0) {
				throw new BadRequestError('Search query is required')
			}

			return await this.searchService.search(query)
		} catch (error) {
			return handleError(error, reply, this.logger)
		}
	}
}
