import { PrismaClient } from '@prisma/client'
import { injectable, inject } from 'tsyringe'
import { BaseRepository, CreateSearchResultModel, SearchResultModel } from '@/types'

@injectable()
export class SearchRepository implements BaseRepository<SearchResultModel> {
	constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

	async create(data: CreateSearchResultModel): Promise<SearchResultModel> {
		return this.prisma.searchResult.create({
			data: {
				query: data.query.toLowerCase(),
				results: data.results
			}
		})
	}

	async findOne(query: string): Promise<SearchResultModel | null> {
		return this.prisma.searchResult.findFirst({
			where: {
				query: query.toLowerCase()
			}
		})
	}

	async update(query: string, data: Partial<SearchResultModel>): Promise<SearchResultModel> {
		throw new Error('Method not implemented.')
	}

	async findAll(query: string): Promise<SearchResultModel[]> {
		throw new Error('Method not implemented.')
	}

	async delete(query: string): Promise<void> {
		throw new Error('Method not implemented.')
	}
}
