export interface ITunesApiResponse {
  resultCount: number
  results: ITunesResult[]
}

export interface ITunesResult {
  // Required fields
  wrapperType: string // The type of content returned by the search request
  kind: string // The kind of content returned (e.g., "podcast")
  trackId: number
  artistName: string
  trackName: string
  collectionName: string

  // Media URLs
  artworkUrl30?: string
  artworkUrl60?: string
  artworkUrl100?: string
  artworkUrl600?: string
  feedUrl: string
  previewUrl?: string
  trackViewUrl?: string

  // Content details
  primaryGenreName?: string
  genres?: string[]
  genreIds?: string[]
  releaseDate: string
  
  // Additional metadata
  collectionId?: number
  artistId?: number
  collectionPrice?: number
  trackPrice?: number
  trackRentalPrice?: number
  collectionHdPrice?: number
  trackHdPrice?: number
  trackHdRentalPrice?: number
  
  // Content info
  trackCount?: number
  trackTimeMillis?: number
  country?: string
  currency?: string
  description?: string

  // Flags and ratings
  explicit?: boolean
  trackExplicitness?: string
  collectionExplicitness?: string
  contentAdvisoryRating?: string

  // Search ranking
  primaryGenreId?: number
  radioStationUrl?: string
}

// Helper type for search parameters
export interface ITunesSearchParams {
  term: string
  media?: 'podcast'
  entity?: 'podcast'
  limit?: number
  explicit?: 'Yes' | 'No'
  language?: string
  country?: string
} 