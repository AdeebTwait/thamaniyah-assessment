import { SearchParams, SearchResponse } from '@/lib/types';

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Error messages map for consistent error handling
const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  SERVER_ERROR: 'Something went wrong on our server. Please try again later.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Invalid request parameters.',
  DEFAULT: 'An unexpected error occurred. Please try again.',
} as const;

// Helper function to parse error response
async function parseErrorResponse(response: Response): Promise<string> {
  try {
    const errorData = await response.json();
    return errorData.message || errorData.error || ERROR_MESSAGES.DEFAULT;
  } catch {
    return ERROR_MESSAGES.DEFAULT;
  }
}

// Helper function to get appropriate error message
function getErrorMessage(error: unknown): string {
  if (error instanceof APIError) {
    if (error.status === 404) return ERROR_MESSAGES.NOT_FOUND;
    if (error.status && error.status >= 500) return ERROR_MESSAGES.SERVER_ERROR;
    if (error.status === 400) return ERROR_MESSAGES.VALIDATION_ERROR;
    return error.message;
  }
  
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  
  return ERROR_MESSAGES.DEFAULT;
}

// Use the environment variable for API URL with fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function searchPodcasts(params: SearchParams): Promise<SearchResponse> {
  const searchParams = new URLSearchParams();
	searchParams.append('q', params.q);

  try {
    const response = await fetch(`${API_URL}/api/v1/search?${searchParams.toString()}`);
    
    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response);
      throw new APIError(errorMessage, response.status);
    }
    
    return response.json();
  } catch (error) {
		console.error('API request failed:', error);
    
    if (error instanceof APIError) {
      throw error;
    }
    
    throw new APIError(
      getErrorMessage(error),
      error instanceof Error && 'status' in error ? (error as any).status : undefined
    );
  }
}

export const fetcher = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response);
      throw new APIError(errorMessage, response.status);
    }
    return response.json();
  } catch (error) {
    throw new APIError(getErrorMessage(error));
  }
};
