/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react';
import { Clock, Compass, Headphones, Home, List, Menu, X } from 'lucide-react';
import Link from 'next/link';

export function Sidebar() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			{/* Mobile Menu Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-gray-200 hover:bg-gray-700"
			>
				{isOpen ? <X size={24} /> : <Menu size={24} />}
			</button>

			{/* Backdrop */}
			{isOpen && (
				<div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setIsOpen(false)} />
			)}

			{/* Sidebar */}
			<aside
				className={`fixed top-0 left-0 h-full w-60 bg-gray-950 border-r border-gray-800 flex flex-col transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
			>
				{/* Logo Section */}
				<div className="p-4">
					<div className="mt-4">
						<div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
							<Headphones className="h-6 w-6 text-white" />
						</div>
					</div>
				</div>

				{/* Main Navigation */}
				<nav className="flex-1 px-2">
					<div className="space-y-1 py-2">
						<Link
							href="#"
							className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800"
						>
							<Home className="h-5 w-5" />
							Home
						</Link>
						<Link
							href="#"
							className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800"
						>
							<Compass className="h-5 w-5" />
							Discover
						</Link>
					</div>

					{/* Your Stuff Section */}
					<div className="mt-8">
						<h2 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">YOUR STUFF</h2>
						<div className="mt-2 space-y-1">
							<Link
								href="#"
								className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800"
							>
								<List className="h-5 w-5" />
								My Queue
							</Link>
							<Link
								href="#"
								className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800"
							>
								<Headphones className="h-5 w-5" />
								My Podcasts
							</Link>
							<Link
								href="#"
								className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800"
							>
								<Clock className="h-5 w-5" />
								Recents
							</Link>
						</div>
					</div>
				</nav>

				{/* Footer */}
				<div className="p-4 mt-auto border-t border-gray-800">
					<div className="text-xs text-gray-400">
						<div>Podcaster v1.0 😎</div>
						<div className="flex gap-2 mt-1">
							<Link href="#" className="hover:text-gray-300">
								About
							</Link>
							<span>•</span>
							<Link href="#" className="hover:text-gray-300">
								All Podcasts
							</Link>
						</div>
					</div>
				</div>
			</aside>
		</>
	);
}
