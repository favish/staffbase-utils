import type { Post } from '../types/news/Post'

/**
 * Decides whether a post is within its published window right now.
 *
 * A post counts as published only once its `published` date has passed and
 * before any `unpublished` date. A missing or future `published` date, or a
 * reached `unpublished` date, makes it unpublished.
 * @param {Pick<Post, 'published' | 'unpublished'>} article - The post's publish window.
 * @returns {boolean} True when currently published.
 */
export const isArticlePublished = (
  article: Pick<Post, 'published' | 'unpublished'>,
): boolean => {
  const now = new Date()
  const publishedDate = article.published ? new Date(article.published) : null
  const unpublishedDate = article.unpublished
    ? new Date(article.unpublished)
    : null

  if (!publishedDate || now < publishedDate) return false
  if (unpublishedDate && now >= unpublishedDate) return false

  return true
}
