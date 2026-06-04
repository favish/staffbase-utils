import { ApiError } from './ApiError'

/**
 * Fetches JSON from a URL using Staffbase session credentials.
 *
 * Throws {@link ApiError} (carrying the HTTP status) on a non-2xx response so
 * callers can branch on the status. Network/parse errors propagate as-is. This
 * helper does not log; the calling service layer owns error logging.
 * @template T The expected shape of the parsed JSON body.
 * @param {string} url - The API URL to fetch.
 * @param {RequestInit} [init] - Optional fetch overrides (merged after credentials).
 * @returns {Promise<T>} The parsed JSON body.
 * @throws {ApiError} When the response status is not ok.
 */
export const fetchJson = async <T>(
  url: string,
  init?: RequestInit,
): Promise<T> => {
  const response = await fetch(url, { credentials: 'include', ...init })

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `API request failed with status: ${response.status}`,
    )
  }

  return (await response.json()) as T
}
