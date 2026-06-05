/**
 * Truncates text to a maximum length, replacing the overflow with an ellipsis.
 *
 * The returned string is at most `maxLength` characters (the ellipsis takes the
 * last slot). An absent value yields an empty string; a value already within
 * the limit is returned unchanged.
 * @param {string | null | undefined} text - The text to truncate.
 * @param {number} maxLength - The maximum length of the result, including the ellipsis.
 * @returns {string} The truncated text.
 */
export const truncateText = (
  text: string | null | undefined,
  maxLength: number,
): string => {
  if (!text) return ''
  if (text.length <= maxLength) return text

  return `${text.substring(0, maxLength - 1)}…`
}
