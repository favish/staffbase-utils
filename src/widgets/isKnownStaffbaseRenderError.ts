/**
 * Detects known, benign internal Staffbase errors thrown by `_renderWidget` for
 * individual widgets, so they can be swallowed without aborting the batch.
 * Promoted from unacknowledged-bulletins (`each` / `undefined is not an object`).
 * @param {unknown} error - The thrown value.
 * @returns {boolean} True when the error is a known internal render error.
 */
export const isKnownStaffbaseRenderError = (error: unknown): boolean =>
  error instanceof TypeError &&
  (error.message?.includes('each') ||
    error.message?.includes('undefined is not an object'))
