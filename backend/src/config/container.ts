import { container } from 'tsyringe'
import { PrismaClient } from '@prisma/client'
import { SearchRepository } from '@/repositories/search.repository'
import { SearchService } from '@/services/search.service'
import { ITunesService } from '@/services/itunes.service'
import { SearchController } from '@/api/search.controller'
import { Logger } from '@/utils/logger'

export function setupContainer() {
	// Create a PrismaClient instance
	const prisma = new PrismaClient()

	// Register instances
	container.registerInstance('PrismaClient', prisma)
	container.registerSingleton<Logger>(Logger)

	// Register transient services with useClass option
	container.register<ITunesService>(ITunesService, { useClass: ITunesService })
	container.register<SearchRepository>(SearchRepository, { useClass: SearchRepository })
	container.register<SearchService>(SearchService, { useClass: SearchService })
	container.register<SearchController>(SearchController, { useClass: SearchController })

	return {
		prisma,
		logger: container.resolve(Logger),
		itunesService: container.resolve(ITunesService),
		searchRepository: container.resolve(SearchRepository),
		searchService: container.resolve(SearchService),
		searchController: container.resolve(SearchController)
	}
}

export async function cleanupContainer() {
	const prisma = container.resolve<PrismaClient>('PrismaClient')
	await prisma.$disconnect()
	container.clearInstances()
} 