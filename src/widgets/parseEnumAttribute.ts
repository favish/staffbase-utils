/**
 * Parses a widget attribute constrained to a known set of values. Trims the
 * input and returns the default when it is blank or not one of `validValues`.
 * @template T The string-literal union of accepted values.
 * @param {string | null | undefined} value - The raw attribute value.
 * @param {readonly T[]} validValues - The accepted values.
 * @param {T} defaultValue - The value to use when invalid or blank.
 * @returns {T} The validated value.
 */
export const parseEnumAttribute = <T extends string>(
  value: string | null | undefined,
  validValues: readonly T[],
  defaultValue: T,
): T => {
  const normalized = value?.trim() as T | undefined
  if (!normalized) return defaultValue

  return validValues.includes(normalized) ? normalized : defaultValue
}
