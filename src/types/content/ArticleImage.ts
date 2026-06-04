import type { ArticleImageVariant } from './ArticleImageVariant'

/**
 * The set of rendition variants the Staffbase media API returns for an article
 * image. Named `ArticleImage` (not `Image`) to avoid shadowing the DOM global.
 */
export interface ArticleImage {
  original: ArticleImageVariant & { size: number }
  original_scaled: ArticleImageVariant
  thumb: ArticleImageVariant
  wide: ArticleImageVariant
  compact: ArticleImageVariant
  wide_first: ArticleImageVariant
  compact_first: ArticleImageVariant
}
