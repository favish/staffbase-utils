import type { ArticleImage } from './ArticleImage'

/**
 * The per-language content of an article (one entry of `ArticleData.contents`).
 *
 * `image` is `ArticleImage | string | null` because the API returns either the
 * structured rendition set, a bare URL string, or nothing. Shared verbatim by
 * the alerts and unacknowledged-bulletins widgets.
 */
export interface LocalizedContent {
  title: string
  teaser: string
  content: string
  image: ArticleImage | string | null
  feedImage: string | null
}
