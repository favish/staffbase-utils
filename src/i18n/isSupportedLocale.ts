import type { StaffbaseLocale } from '../types/i18n/StaffbaseLocale'
import { STAFFBASE_LOCALES } from './staffbaseLocales'

/**
 * Type guard: narrows an arbitrary string to a `StaffbaseLocale` when it is one
 * of the canonical, exactly-cased locale codes (e.g. `'en_US'`). Does not
 * normalize - pass values through `normalizeLanguageCode` first if they may use
 * a different separator or casing.
 * @param {string | null | undefined} value - The value to test.
 * @returns {value is StaffbaseLocale} True when `value` is a supported locale code.
 */
export const isSupportedLocale = (
  value: string | null | undefined,
): value is StaffbaseLocale =>
  typeof value === 'string' &&
  Object.prototype.hasOwnProperty.call(STAFFBASE_LOCALES, value)
