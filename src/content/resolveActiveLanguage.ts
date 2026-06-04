import type { ResolveLocalizedContentOptions } from '../types/content/ResolveLocalizedContentOptions'
import { detectEditorLanguage } from './detectEditorLanguage'
import { detectPreviewLanguage } from './detectPreviewLanguage'

/**
 * Resolves the language to render content in.
 *
 * Editor path: the selected language tab wins. Runtime path: the explicit
 * `contentLanguage` is trusted first so the article language matches the rest of
 * the UI, with preview-URL sniffing only as a fallback. Both paths fall back to
 * `contentLanguage ?? defaultLanguage`.
 * @param {ResolveLocalizedContentOptions} options - The resolution options.
 * @returns {string} The resolved active language code.
 */
export const resolveActiveLanguage = (
  options: ResolveLocalizedContentOptions,
): string => {
  const { contentLanguage, defaultLanguage, isEditor } = options
  const fallback = contentLanguage ?? defaultLanguage

  if (isEditor) return detectEditorLanguage() ?? fallback

  return contentLanguage ?? detectPreviewLanguage() ?? fallback
}
