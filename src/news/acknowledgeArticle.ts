import { ApiError } from '../api/ApiError'
import { getStaffbaseCsrfToken } from '../host/getStaffbaseCsrfToken'
import type { NewsApiConfig } from '../types/news/NewsApiConfig'

/**
 * Acknowledges a post for the current user.
 *
 * Fails fast (and reports via onError) when no CSRF token is available, since a
 * tokenless POST is guaranteed to be rejected and would otherwise surface as a
 * silent failure. On a non-OK response it reports the status and body, then
 * throws a typed ApiError so callers can branch on `status`.
 * @param {NewsApiConfig} config - The injected service configuration.
 * @param {string} id - The post id to acknowledge.
 * @returns {Promise<void>} Resolves when the acknowledgement succeeds.
 * @throws {ApiError | Error} On a missing CSRF token or a failed request.
 */
export const acknowledgeArticle = async (
  config: NewsApiConfig,
  id: string,
): Promise<void> => {
  const csrfToken = (config.getCsrfToken ?? getStaffbaseCsrfToken)()

  if (!csrfToken) {
    const error = new Error(
      `Cannot acknowledge article ${id}: missing CSRF token`,
    )
    config.onError?.('Acknowledgment aborted:', error)
    throw error
  }

  const response = await fetch(
    `${config.apiUrl}/posts/${id}/acknowledgements`,
    {
      method: 'POST',
      headers: {
        'X-Csrf-Token': csrfToken,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      // Include the session cookie for authentication.
      credentials: 'include',
    },
  )

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    config.onError?.(
      `Failed to acknowledge article ${id}:`,
      response.statusText,
      detail,
    )
    throw new ApiError(
      response.status,
      `Failed to acknowledge article ${id}: ${response.statusText}`,
    )
  }
}
