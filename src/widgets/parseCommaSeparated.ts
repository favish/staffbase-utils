/**
 * Parses a comma-separated widget attribute into a trimmed, non-empty string
 * array.
 *
 * Returns undefined for an absent/blank value, and also for legacy base64
 * payloads (`data:text/plain;base64,...`) that older Staffbase versions stored,
 * so those never leak through as bogus filter entries.
 * @param {string | null | undefined} value - The raw attribute value.
 * @returns {string[] | undefined} The parsed list, or undefined.
 */
export const parseCommaSeparated = (
  value: string | null | undefined,
): string[] | undefined => {
  if (!value || value.trim() === '') return undefined
  if (value.startsWith('data:text/plain;base64')) return undefined

  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}
