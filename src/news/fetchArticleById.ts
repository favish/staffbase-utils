import { fetchJson } from '../api/fetchJson'
import type { NewsApiConfig } from '../types/news/NewsApiConfig'
import type { Post } from '../types/news/Post'

/**
 * Fetches a single post by id.
 * @template TArticle The post shape returned (defaults to Post).
 * @param {NewsApiConfig} config - The injected service configuration.
 * @param {string} articleId - The post id.
 * @returns {Promise<TArticle>} The post.
 */
export const fetchArticleById = <TArticle = Post>(
  config: NewsApiConfig,
  articleId: string,
): Promise<TArticle> =>
  fetchJson<TArticle>(`${config.apiUrl}/posts/${articleId}`)
