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