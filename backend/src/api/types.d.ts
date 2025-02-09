import { ITunesResult } from '@/types'

export interface SearchQueryParams {
	q: string
}

export interface SearchResponse {
	podcasts: ITunesResult[]
	episodes: ITunesResult[]
	resultCount: number
}
