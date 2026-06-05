/**
 * Parses a widget string attribute, returning the default (or undefined) when
 * the value is absent or blank.
 * @param {string | null | undefined} value - The raw attribute value.
 * @param {string} [defaultValue] - The value to use when absent or blank.
 * @returns {string | undefined} The string value, the default, or undefined.
 */
export const parseStringAttribute = (
  value: string | null | undefined,
  defaultValue?: string,
): string | undefined => {
  if (value === undefined || value === null || value.trim() === '') {
    return defaultValue
  }

  return value
}
