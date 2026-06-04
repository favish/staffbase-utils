import type { ArticleImageVariant } from '../content/ArticleImageVariant'

/**
 * The avatar rendition set of a news post author.
 *
 * Grounded in a live single-post read (`GET /api/posts/{id}` /
 * `GET /api/articles/{id}`): `original` carries a byte `size`, `icon` and
 * `thumb` do not. Reuses {@link ArticleImageVariant}.
 */
export interface PostAuthorAvatar {
  original: ArticleImageVariant & { size: number }
  icon: ArticleImageVariant
  thumb: ArticleImageVariant
  publicID: string
}
