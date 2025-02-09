interface RetryOptions {
	maxAttempts?: number
	delayMs?: number
	backoff?: boolean
	shouldRetry?: (error: unknown) => boolean
}

const defaultOptions: Required<RetryOptions> = {
	maxAttempts: 3,
	delayMs: 1000,
	backoff: true,
	shouldRetry: (error: unknown) => true
}

export async function withRetry<T>(
	operation: () => Promise<T>,
	options: RetryOptions = {}
): Promise<T> {
	const opts = { ...defaultOptions, ...options }
	let lastError: unknown

	for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
		try {
			return await operation()
		} catch (error) {
			lastError = error

			if (!opts.shouldRetry(error) || attempt === opts.maxAttempts) {
				throw error
			}

			const delay = opts.backoff ? opts.delayMs * Math.pow(2, attempt - 1) : opts.delayMs
			await new Promise(resolve => setTimeout(resolve, delay))
		}
	}

	throw lastError
}
