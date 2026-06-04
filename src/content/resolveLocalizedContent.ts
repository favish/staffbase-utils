import type { LocalizedContent } from '../types/content/LocalizedContent'
import type { ResolveLocalizedContentOptions } from '../types/content/ResolveLocalizedContentOptions'
import { resolveActiveLanguage } from './resolveActiveLanguage'

/**
 * Selects and field-merges the localized article content for the active language.
 *
 * Resolves the active language (see resolveActiveLanguage), picks that language's
 * content (falling back to the default language), then fills each field from the
 * default-language entry when the active one is empty. Returns null and reports
 * via `onError` when contents are missing or unavailable in both languages.
 * @param {Record<string, LocalizedContent> | undefined} contents - The article's per-language contents.
 * @param {ResolveLocalizedContentOptions} options - Language and diagnostics options.
 * @returns {LocalizedContent | null} The merged localized content, or null.
 */
export const resolveLocalizedContent = (
  contents: Record<string, LocalizedContent> | undefined,
  options: ResolveLocalizedContentOptions,
): LocalizedContent | null => {
  const { defaultLanguage, onError } = options

  if (!contents) {
    onError?.('Invalid article data or missing contents')
    return null
  }

  const language = resolveActiveLanguage(options)
  const localized = contents[language] || contents[defaultLanguage] || null

  if (!localized) {
    onError?.(
      `Content unavailable for language: ${language} or fallback: ${defaultLanguage}`,
    )
    return null
  }

  const fallback = contents[defaultLanguage]

  return {
    title: localized.title || fallback?.title || '',
    teaser: localized.teaser || fallback?.teaser || '',
    content: localized.content || fallback?.content || '',
    image: localized.image || fallback?.image || '',
    feedImage: localized.feedImage || fallback?.feedImage || '',
  }
}
