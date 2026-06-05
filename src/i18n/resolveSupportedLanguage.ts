import type { ResolveSupportedLanguageOptions } from '../types/i18n/ResolveSupportedLanguageOptions'
import type { StaffbaseLocale } from '../types/i18n/StaffbaseLocale'
import { normalizeLanguageCode } from './normalizeLanguageCode'

/**
 * Picks the best supported locale to render content in.
 *
 * Resolution order: the normalized `requested` locale when it is supported and
 * (if `available` is given) present there; otherwise an available locale that
 * shares the requested language; otherwise `defaultLocale` when available (or
 * when no `available` set was given); otherwise the first available locale.
 * Always returns a supported `StaffbaseLocale` so callers never handle null.
 * @param {ResolveSupportedLanguageOptions} options - Requested/available/default locales.
 * @returns {StaffbaseLocale} The resolved supported locale.
 */
export const resolveSupportedLanguage = (
  options: ResolveSupportedLanguageOptions,
): StaffbaseLocale => {
  const { requested, available, defaultLocale } = options

  const requestedLocale = normalizeLanguageCode(requested)
  const availableLocales = (available ?? [])
    .map((code) => normalizeLanguageCode(code))
    .filter((code): code is StaffbaseLocale => code !== null)

  if (availableLocales.length === 0) {
    return requestedLocale ?? defaultLocale
  }

  if (requestedLocale) {
    if (availableLocales.includes(requestedLocale)) return requestedLocale

    const requestedLanguage = requestedLocale.split('_')[0]
    const sameLanguage = availableLocales.find(
      (locale) => locale.split('_')[0] === requestedLanguage,
    )
    if (sameLanguage) return sameLanguage
  }

  return availableLocales.includes(defaultLocale)
    ? defaultLocale
    : availableLocales[0]
}
