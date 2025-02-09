import { FastifyReply } from 'fastify'
import { Logger } from '@/utils/logger'

// Error codes enum for consistent error codes across the application
export enum ErrorCode {
	VALIDATION_ERROR = 'VALIDATION_ERROR',
	NOT_FOUND = 'NOT_FOUND',
	UNAUTHORIZED = 'UNAUTHORIZED',
	FORBIDDEN = 'FORBIDDEN',
	INTERNAL_ERROR = 'INTERNAL_ERROR',
	BAD_REQUEST = 'BAD_REQUEST',
	SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE'
}

// Base error class for application errors
export class AppError extends Error {
	constructor(
		public readonly message: string,
		public readonly statusCode: number = 500,
		public readonly code: ErrorCode = ErrorCode.INTERNAL_ERROR,
		public readonly data?: any
	) {
		super(message)
		this.name = this.constructor.name
		Error.captureStackTrace(this, this.constructor)
	}
}

// Specific error classes for different types of errors
export class ValidationError extends AppError {
	constructor(message: string, data?: any) {
		super(message, 400, ErrorCode.VALIDATION_ERROR, data)
	}
}

export class NotFoundError extends AppError {
	constructor(message: string) {
		super(message, 404, ErrorCode.NOT_FOUND)
	}
}

export class UnauthorizedError extends AppError {
	constructor(message: string = 'Unauthorized') {
		super(message, 401, ErrorCode.UNAUTHORIZED)
	}
}

export class ForbiddenError extends AppError {
	constructor(message: string = 'Forbidden') {
		super(message, 403, ErrorCode.FORBIDDEN)
	}
}

export class BadRequestError extends AppError {
	constructor(message: string, data?: any) {
		super(message, 400, ErrorCode.BAD_REQUEST, data)
	}
}

export class ServiceUnavailableError extends AppError {
	constructor(message: string = 'Service Unavailable') {
		super(message, 503, ErrorCode.SERVICE_UNAVAILABLE)
	}
}

// Error handler function for consistent error responses
export async function handleError(
	error: unknown,
	reply: FastifyReply,
	logger: Logger
): Promise<never> {
	// Log the error
	const errorDetails =
		error instanceof Error
			? {
					message: error.message,
					name: error.name,
					stack: error.stack,
					...(error instanceof AppError && {
						statusCode: error.statusCode,
						code: error.code,
						data: error.data
					})
				}
			: String(error)
	await logger.error({ errorDetails }, 'Error occurred')

	// Handle known application errors
	if (error instanceof AppError) {
		reply.status(error.statusCode).send({
			error: error.code,
			message: error.message,
			...(error.data && { data: error.data })
		})
		throw error
	}

	// Handle validation errors from Fastify
	if (error && typeof error === 'object' && 'validation' in error) {
		const validationError = new ValidationError('Validation failed', error)
		reply.status(validationError.statusCode).send({
			error: validationError.code,
			message: validationError.message,
			data: validationError.data
		})
		throw validationError
	}

	// Handle unknown errors
	const unknownError = new AppError(
		'An unexpected error occurred',
		500,
		ErrorCode.INTERNAL_ERROR,
		process.env.NODE_ENV === 'development' ? error : undefined
	)

	reply.status(unknownError.statusCode).send({
		error: unknownError.code,
		message: unknownError.message,
		...(unknownError.data && { data: unknownError.data })
	})
	throw unknownError
}
