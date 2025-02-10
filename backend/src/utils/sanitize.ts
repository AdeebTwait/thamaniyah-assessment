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
			// Allow Arabic characters (Unicode range \u0600-\u06FF), alphanumeric, spaces, and basic punctuation
			.replace(/[^\u0600-\u06FF\w\s.,!?-]/g, '')
			.slice(0, MAX_QUERY_LENGTH)
			.trim()
	)
}
