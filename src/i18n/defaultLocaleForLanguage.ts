import type { StaffbaseLocale } from '../types/i18n/StaffbaseLocale'
import { STAFFBASE_LOCALES } from './staffbaseLocales'

/**
 * Resolves a bare two-letter language code (e.g. `'pt'`) to the default
 * Staffbase locale for that language (e.g. `'pt_BR'`).
 *
 * "Default" means the first matching entry in `STAFFBASE_LOCALES`, so the
 * preferred region for multi-region languages is controlled purely by that
 * map's ordering. Returns null when no supported locale uses the language.
 * @param {string} language - A two-letter language code (case-insensitive).
 * @returns {StaffbaseLocale | null} The default locale, or null when unsupported.
 */
export const defaultLocaleForLanguage = (
  language: string,
): StaffbaseLocale | null => {
  const prefix = `${language.toLowerCase()}_`
  const match = Object.keys(STAFFBASE_LOCALES).find((locale) =>
    locale.startsWith(prefix),
  )

  return (match as StaffbaseLocale | undefined) ?? null
}
