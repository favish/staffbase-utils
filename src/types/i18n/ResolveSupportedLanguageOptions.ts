import type { StaffbaseLocale } from './StaffbaseLocale'

/**
 * Options for resolveSupportedLanguage.
 */
export interface ResolveSupportedLanguageOptions {
  /**
   * The locale the host/user/config asked for, in any loose form. Normalized
   * internally; an unsupported value is ignored in favour of `defaultLocale`.
   */
  requested?: string | null
  /**
   * The locales the content is actually available in (raw codes are fine, they
   * are normalized). When provided, the resolver only returns a locale present
   * here, preferring an exact match, then a same-language match.
   */
  available?: readonly string[]
  /**
   * Fallback locale used when `requested` is missing/unsupported or absent from
   * `available`. Required and injected by the caller because the library never
   * reads env or assumes a global default.
   */
  defaultLocale: StaffbaseLocale
}
