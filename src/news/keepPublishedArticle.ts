import type { Post } from '../types/news/Post'
import { isArticlePublished } from './isArticlePublished'

/**
 * Pagination mapper that keeps only currently-published posts (drops others by
 * returning null), preserving the post type. Constrained to the publish-window
 * fields so widget view-models that narrow other fields still qualify.
 * @template TArticle The post shape (must carry the publish-window fields).
 * @param {TArticle} article - The post to test.
 * @returns {TArticle | null} The post when published, otherwise null.
 */
export const keepPublishedArticle = <
  TArticle extends Pick<Post, 'published' | 'unpublished'>,
>(
  article: TArticle,
): TArticle | null => (isArticlePublished(article) ? article : null)
