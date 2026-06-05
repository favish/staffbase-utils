import type { StaffbaseLocale } from '../types/i18n/StaffbaseLocale'
import { defaultLocaleForLanguage } from './defaultLocaleForLanguage'
import { isSupportedLocale } from './isSupportedLocale'

/**
 * Normalizes an arbitrary language tag to a canonical Staffbase locale code.
 *
 * Accepts the loose forms widgets receive in practice - BCP-47 (`en-US`),
 * snake_case (`en_US`), wrong casing (`EN_us`), or a bare language (`en`) - and
 * returns the exactly-cased supported locale (`en_US`). A full tag with an
 * unsupported region falls back to the language's default region
 * (`es_AR` -> `es_ES`). Returns null when the language is not supported at all.
 * @param {string | null | undefined} input - The language tag to normalize.
 * @returns {StaffbaseLocale | null} The canonical locale, or null when unsupported.
 */
export const normalizeLanguageCode = (
  input: string | null | undefined,
): StaffbaseLocale | null => {
  if (!input) return null

  const [rawLanguage, rawRegion] = input.trim().replace(/-/g, '_').split('_')
  if (!rawLanguage) return null

  const language = rawLanguage.toLowerCase()

  if (rawRegion) {
    const candidate = `${language}_${rawRegion.toUpperCase()}`
    if (isSupportedLocale(candidate)) return candidate
  }

  return defaultLocaleForLanguage(language)
}
