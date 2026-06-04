/**
 * Default onError for renderWidgets: warns only on the critical
 * 'manager-unavailable' context so a platform regression stays visible in logs
 * without spamming per-widget noise. Consumers can pass their own onError.
 * @param {unknown} error - The swallowed error.
 * @param {string} context - Where it happened.
 * @returns {void}
 */
export const defaultWidgetOnError = (error: unknown, context: string): void => {
  if (context === 'manager-unavailable') {
    console.warn(
      '[staffbase-utils] Staffbase widget manager unavailable; embedded widgets were not rendered.',
      error,
    )
  }
}
