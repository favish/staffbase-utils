import type { StaffbaseLocale } from '../types/i18n/StaffbaseLocale'
import { normalizeLanguageCode } from './normalizeLanguageCode'

/**
 * Reads the browser's preferred language and normalizes it to a supported
 * Staffbase locale.
 *
 * Walks `navigator.languages` (most preferred first), falling back to
 * `navigator.language`, and returns the first entry that maps to a supported
 * locale. Returns null when there is no navigator or none of the preferences
 * are supported, so callers can fall back to their injected default.
 * @returns {StaffbaseLocale | null} The preferred supported locale, or null.
 */
export const getBrowserLanguage = (): StaffbaseLocale | null => {
  if (typeof navigator === 'undefined') return null

  const candidates =
    navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language]

  for (const candidate of candidates) {
    const normalized = normalizeLanguageCode(candidate)
    if (normalized) return normalized
  }

  return null
}
