import Image from 'next/image';
import { Podcast } from '@/lib/types';

interface PodcastCardProps {
	podcast: Podcast;
	priority?: boolean;
}

export function PodcastCard({ podcast, priority = false }: PodcastCardProps) {
	return (
		<div className="w-[160px] sm:w-[200px] flex-none group relative bg-gray-900/50 rounded-lg overflow-hidden hover:bg-gray-900 transition-all">
			<div className="aspect-square relative">
				<Image
					src={podcast.artworkUrl600 || '/placeholder.svg'}
					alt={podcast.collectionName}
					fill
					sizes="(max-width: 640px) 160px, 200px"
					className="object-cover"
					priority={priority}
					onError={() => {
						// Handle error by falling back to placeholder in src prop
						return true;
					}}
				/>
			</div>
			<div className="p-3">
				<h3 className="font-semibold text-sm line-clamp-1">{podcast.collectionName}</h3>
				<p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{podcast.artistName}</p>
				<p className="text-xs text-gray-500 mt-1">{podcast.primaryGenreName}</p>
			</div>
		</div>
	);
}
