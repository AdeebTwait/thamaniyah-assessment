import { FastifyReply } from 'fastify'
import { ZodError } from 'zod'
import { Logger } from './logger'
import { RequestContext } from './context'

/**
 * Handle all types of errors and send appropriate response
 */
export function handleError(error: unknown, reply: FastifyReply, logger: Logger) {
  const interactionId = RequestContext.getInteractionId()

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return handleValidationError(error, reply, logger)
  }

  // Handle application-specific errors
  if (error instanceof AppError) {
    logger.error({ 
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
      stack: error.stack
    }, 'Application error occurred')

    return reply.status(error.statusCode).send({
      error: error.name,
      message: error.message,
      code: error.code,
      interaction_id: interactionId
    })
  }
  
  // Handle validation errors from Zod
  function handleValidationError(error: ZodError, reply: FastifyReply, logger: Logger) {
    logger.warn('Validation error:', error.errors)
    
    return reply.status(400).send({
      error: 'ValidationError',
      message: 'Invalid input data',
      details: error.errors
    })
  }

  // Handle all other errors
  logger.error({
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined
  }, 'Unexpected error occurred')

  return reply.status(500).send({
    error: 'InternalServerError',
    message: 'An unexpected error occurred',
    interaction_id: interactionId
  })
}
