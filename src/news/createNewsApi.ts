import type { FetchArticlesOptions } from '../types/news/FetchArticlesOptions'
import type { NewsApi } from '../types/news/NewsApi'
import type { NewsApiConfig } from '../types/news/NewsApiConfig'
import type { Post } from '../types/news/Post'
import { acknowledgeArticle } from './acknowledgeArticle'
import { fetchArticleById } from './fetchArticleById'
import { fetchArticles } from './fetchArticles'
import { fetchChannel } from './fetchChannel'
import { fetchChannels } from './fetchChannels'
import { fetchSpaceName } from './fetchSpaceName'

/**
 * Builds a news service bound to one host configuration.
 *
 * Replaces the per-widget `apiService` modules that the alerts,
 * unacknowledged-bulletins and global-content widgets each maintained: a fix or
 * improvement here (CSRF fail-fast, typed errors, robust title fallback) now
 * reaches every consumer at once. Each returned method is a thin binding over a
 * single-purpose function in this module.
 * @param {NewsApiConfig} config - The injected, host-specific configuration.
 * @returns {NewsApi} The bound news service.
 */
export const createNewsApi = (config: NewsApiConfig): NewsApi => ({
  fetchChannels() {
    return fetchChannels(config)
  },
  fetchChannel(channelId: string) {
    return fetchChannel(config, channelId)
  },
  fetchSpaceName(spaceId: string) {
    return fetchSpaceName(config, spaceId)
  },
  fetchArticles<
    TArticle extends Pick<Post, 'published' | 'unpublished'> = Post,
  >(channelId: string, options?: FetchArticlesOptions) {
    return fetchArticles<TArticle>(config, channelId, options)
  },
  fetchArticleById<TArticle = Post>(articleId: string) {
    return fetchArticleById<TArticle>(config, articleId)
  },
  acknowledgeArticle(id: string) {
    return acknowledgeArticle(config, id)
  },
})
