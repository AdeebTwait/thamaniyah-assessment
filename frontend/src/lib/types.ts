export interface Podcast {
	wrapperType: string;
	kind: string;
	trackId: number;
	artistName: string;
	trackName: string;
	collectionName: string;
	artworkUrl30?: string;
	artworkUrl60?: string;
	artworkUrl100?: string;
	artworkUrl600?: string;
	feedUrl: string;
	previewUrl?: string;
	trackViewUrl?: string;
	primaryGenreName?: string;
	genres?: string[];
	genreIds?: string[];
	releaseDate: string;
	collectionId?: number;
	artistId?: number;
	collectionPrice?: number;
	trackPrice?: number;
	trackRentalPrice?: number;
	collectionHdPrice?: number;
	trackHdPrice?: number;
	trackHdRentalPrice?: number;
	trackCount?: number;
	trackTimeMillis?: number;
	country?: string;
	currency?: string;
	description?: string;
	explicit?: boolean;
	trackExplicitness?: string;
	collectionExplicitness?: string;
	contentAdvisoryRating?: string;
}

export interface SearchResponse {
	podcasts: Podcast[];
	episodes: Podcast[];
	resultCount: number;
}

export interface SearchParams {
	q: string;
}
