'use client';

// React and third-party imports
import { useState, useEffect, ChangeEvent } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { Search } from 'lucide-react';

// Components
import { EpisodeCard } from '@/components/episode-card';
import { PodcastCard } from '@/components/podcast-card';
import { Sidebar } from '@/components/sidebar';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

// API and types
import { searchPodcasts } from '@/lib/api';
import { Podcast } from '@/lib/types';

const DEBOUNCE_MS = 700;

export default function PodcastSearch() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [search, setSearch] = useState(searchParams.get('q') || '');
	const [podcasts, setPodcasts] = useState<Podcast[]>([]);
	const [episodes, setEpisodes] = useState<Podcast[]>([]);
	const [loading, setLoading] = useState(false);
	const [debouncedSearch] = useDebounce(search, DEBOUNCE_MS);
	const { toast } = useToast();

	// Update URL when search changes
	useEffect(() => {
		if (debouncedSearch === searchParams.get('q')) return;

		const params = new URLSearchParams(searchParams.toString());
		if (debouncedSearch) {
			params.set('q', debouncedSearch);
		} else {
			params.delete('q');
		}
		const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
		router.replace(newUrl);
	}, [debouncedSearch, pathname, router, searchParams]);

	useEffect(() => {
		async function fetchPodcasts() {
			if (!debouncedSearch) {
				setPodcasts([]);
				setEpisodes([]);
				return;
			}

			setLoading(true);
			try {
				const response = await searchPodcasts({ q: debouncedSearch });
				setPodcasts(response.podcasts || []);
				setEpisodes(response.episodes || []);
			} catch (error) {
				console.error('Failed to fetch podcasts:', error);
				setPodcasts([]);
				setEpisodes([]);

				toast({
					variant: 'destructive',
					title: 'Error',
					description: error instanceof Error ? error.message : 'Failed to fetch podcasts',
					duration: 5000,
				});
			} finally {
				setLoading(false);
			}
		}

		fetchPodcasts();
	}, [debouncedSearch, toast]);

	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
	};

	const renderContent = () => {
		if (loading) {
			return (
				<div className="text-center py-12">
					<div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
					<p className="mt-4 text-gray-400">Searching podcasts...</p>
				</div>
			);
		}

		if (!debouncedSearch) {
			return (
				<div className="text-center py-20">
					<Search className="h-12 w-12 mx-auto mb-4 text-gray-500" strokeWidth={1.5} />
					<p className="text-lg text-gray-400">Search for your favorite podcasts</p>
				</div>
			);
		}

		if (debouncedSearch && podcasts.length === 0 && episodes.length === 0) {
			return (
				<div className="text-center py-12">
					<p className="text-gray-400">No results found for "{debouncedSearch}"</p>
				</div>
			);
		}

		return (
			<>
				{podcasts.length > 0 && (
					<section className="mb-8">
						<h2 className="text-xl font-semibold mb-4">Top Podcasts</h2>
						<ScrollArea className="w-full whitespace-nowrap rounded-lg">
							<div className="flex space-x-4 pb-4">
								{podcasts.map((podcast) => (
									<PodcastCard key={podcast.collectionId} podcast={podcast} />
								))}
							</div>
							<ScrollBar orientation="horizontal" className="bg-gray-800" />
						</ScrollArea>
					</section>
				)}

				{episodes.length > 0 && (
					<section>
						<h2 className="text-xl font-semibold mb-4">Top Episodes</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
							{episodes.map((episode) => (
								<EpisodeCard key={episode.trackId} episode={episode} />
							))}
						</div>
					</section>
				)}
			</>
		);
	};

	return (
		<div className="min-h-screen bg-gray-950 text-white">
			<Sidebar />

			<div className="lg:ml-60 min-h-screen">
				<header className="sticky top-0 z-10 bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
					<div className="px-4 py-4">
						<div className="relative max-w-xl mx-auto pl-12 lg:pl-0">
							<Search className="absolute left-[3.25rem] lg:left-3 top-2.5 h-5 w-5 text-gray-400" />
							<Input
								type="search"
								placeholder="Search podcasts..."
								className="w-full pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500"
								value={search}
								onChange={handleSearchChange}
							/>
						</div>
					</div>
				</header>

				<main className="px-4 py-8">{renderContent()}</main>
			</div>
		</div>
	);
}
