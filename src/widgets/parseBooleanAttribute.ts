/**
 * Parses a widget boolean attribute, treating only the literal string `'true'`
 * as true. An absent or blank value yields the provided default.
 * @param {string | null | undefined} value - The raw attribute value.
 * @param {boolean} defaultValue - The value to use when absent or blank.
 * @returns {boolean} The parsed boolean.
 */
export const parseBooleanAttribute = (
  value: string | null | undefined,
  defaultValue: boolean,
): boolean => {
  if (value === undefined || value === null || value.trim() === '') {
    return defaultValue
  }

  return value === 'true'
}
