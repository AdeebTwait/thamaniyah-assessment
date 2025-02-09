/**
 * Sanitizes a search query by removing potentially harmful characters
 * and enforcing length limits.
 */
export function sanitizeQuery(query: string): string {
	if (!query) return ''

	const MAX_QUERY_LENGTH = 100

	return (
		query
			.toString()
			.trim()
			.toLowerCase()
			// Remove special characters and maintain only alphanumeric, spaces, and basic punctuation
			.replace(/[^\w\s.,!?-]/g, '')
			.slice(0, MAX_QUERY_LENGTH)
			.trim()
	)
}
