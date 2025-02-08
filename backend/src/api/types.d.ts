import { ITunesResult } from '@/types'

export interface SearchQueryParams {
  q: string
}

export interface SearchResponse {
  results: ITunesResult[]
  resultCount: number
  fromCache: boolean
}
