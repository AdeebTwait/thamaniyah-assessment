import 'reflect-metadata'
import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import cors from '@fastify/cors'
import { setupContainer, cleanupContainer } from './config/container'
import { AppError } from "./utils/error-handler"
import { config } from './config/env.config'
import { RequestContext } from './utils/context'

// Create Fastify instance with logging
const server: FastifyInstance = Fastify({
  logger: {
    level: config.env.LOG_LEVEL,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  }
})

// Register plugins
server.register(cors, {
  origin: config.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: false
})

// Error handler
server.setErrorHandler((error: any, request: FastifyRequest, reply: FastifyReply) => {
  request.log.error(error)

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: error.name,
      message: error.message,
      code: error.code
    })
  }

  // Handle validation errors
  if (error.validation) {
    return reply.status(400).send({
      error: 'ValidationError',
      message: error.message,
      validation: error.validation
    })
  }

  return reply.status(500).send({
    error: 'InternalServerError',
    message: 'An unexpected error occurred'
  })
})

// Initialize container
let container = setupContainer()

// Add this hook before routes
server.addHook('onRequest', async (request, reply) => {
  const interactionId = RequestContext.setInteractionId()
  request.log.info({ 
    interaction_id: interactionId,
    method: request.method, 
    url: request.url, 
    query: request.query,
    headers: request.headers
  }, 'Incoming request')
})

// API Routes with versioning
server.register(async function v1(fastify: FastifyInstance) {
  // Search endpoint
  fastify.get('/search', {
    schema: {
      querystring: {
        type: 'object',
        required: ['q'],
        properties: {
          q: { type: 'string', minLength: 1 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            results: { 
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: true
              }
            },
            resultCount: { type: 'number' },
            fromCache: { type: 'boolean' }
          }
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        },
        500: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: container.searchController.search
  })

  // Health check endpoint
  fastify.get('/health', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' }
          }
        }
      }
    },
    handler: async () => ({
      status: 'ok',
      timestamp: new Date().toISOString()
    })
  })
}, { prefix: '/api/v1' })

// Start the server
const start = async (): Promise<void> => {
  try {
    const { PORT, HOST } = config.env
    await server.listen({ port: PORT, host: HOST })
    server.log.info(`Server listening on http://${HOST}:${PORT}`)
  } catch (err) {
    server.log.error(err)
    server.close()
    process.exit(1)
  }
}

// Handle graceful shutdown
const gracefulShutdown = async (signal: string) => {
  server.log.info(`Received ${signal}. Shutting down gracefully...`)
  
  try {
    await cleanupContainer()
    await server.close()
    process.exit(0)
  } catch (err) {
    server.log.error('Error during shutdown:', err)
    process.exit(1)
  }
}

// Signal handlers
const signals = ['SIGTERM', 'SIGINT'] as const
signals.forEach(signal => {
  process.on(signal, () => gracefulShutdown(signal))
})

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  server.log.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

process.on('uncaughtException', (error) => {
  server.log.error('Uncaught Exception:', error)
  process.exit(1)
})

// Start the server
start() 