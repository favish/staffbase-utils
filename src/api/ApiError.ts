/**
 * Error thrown by the API layer when a request resolves with a non-2xx status.
 * Carries the HTTP status so callers can branch (e.g. distinguish 401/403 from
 * 5xx) instead of collapsing every failure into one generic message.
 */
export class ApiError extends Error {
  public readonly status: number

  /**
   * Creates an ApiError carrying the failed response status.
   * @param {number} status - The HTTP status code of the failed response.
   * @param {string} message - A human-readable error message.
   */
  public constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}
