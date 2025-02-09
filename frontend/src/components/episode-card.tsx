import Image from 'next/image';
import { Podcast } from '@/lib/types';

interface EpisodeCardProps {
	episode: Podcast;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
	return (
		<div className="group relative bg-gray-900/50 rounded-lg overflow-hidden hover:bg-gray-900 transition-all">
			<div className="flex p-3 space-x-3">
				<div className="w-16 h-16 sm:w-20 sm:h-20 relative flex-none">
					<Image
						src={episode.artworkUrl600 || '/placeholder.svg'}
						alt={episode.trackName}
						fill
						sizes="(max-width: 640px) 64px, 80px"
						className="object-cover rounded-md"
						loading="lazy"
						onError={() => {
							// Handle error by falling back to placeholder in src prop
							return true;
						}}
					/>
				</div>
				<div className="flex-1 min-w-0 py-1">
					<h3 className="font-semibold text-sm line-clamp-2">{episode.trackName}</h3>
					<p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{episode.collectionName}</p>
					<p className="text-xs text-gray-500 mt-1">{new Date(episode.releaseDate).toLocaleDateString()}</p>
				</div>
			</div>
		</div>
	);
}
