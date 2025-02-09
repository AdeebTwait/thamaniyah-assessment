// Base repository interface
export interface BaseRepository<T> {
	create(data: any): Promise<T>
	findOne(id: string): Promise<T | null>
	update(id: string, data: Partial<T>): Promise<T>
	findAll(query?: string): Promise<T[]>
	delete(id: string): Promise<void>
}

// Search result model types
export interface SearchResultModel {
	id: number
	query: string
	results: string
	createdAt: Date
	updatedAt: Date
}

export interface CreateSearchResultModel {
	query: string
	results: string
}
