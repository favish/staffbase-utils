import type { Channel } from '../content/Channel'
import type { DropdownOption } from '../content/DropdownOption'
import type { FetchArticlesOptions } from './FetchArticlesOptions'
import type { Post } from './Post'

/**
 * The bound news service returned by createNewsApi. Every method already carries
 * the injected configuration, so widgets call them with domain arguments only.
 */
export interface NewsApi {
  /**
   * Lists article channels as selector options (id, title, spaceId), paginated.
   * @returns {Promise<DropdownOption[]>} The channel options.
   */
  fetchChannels: () => Promise<DropdownOption[]>
  /**
   * Fetches a single channel by id.
   * @param {string} channelId - The channel id.
   * @returns {Promise<Channel>} The channel.
   */
  fetchChannel: (channelId: string) => Promise<Channel>
  /**
   * Resolves and caches a space's display name by id.
   * @param {string} spaceId - The space id.
   * @returns {Promise<string>} The space name (empty string when unknown).
   */
  fetchSpaceName: (spaceId: string) => Promise<string>
  /**
   * Fetches a channel's posts, paginated and (by default) filtered to the
   * currently-published window.
   * @template TArticle The post shape returned (defaults to Post).
   * @param {string} channelId - The channel id.
   * @param {FetchArticlesOptions} [options] - Endpoint and filtering options.
   * @returns {Promise<TArticle[]>} The posts.
   */
  fetchArticles: <
    TArticle extends Pick<Post, 'published' | 'unpublished'> = Post,
  >(
    channelId: string,
    options?: FetchArticlesOptions,
  ) => Promise<TArticle[]>
  /**
   * Fetches a single post by id.
   * @template TArticle The post shape returned (defaults to Post).
   * @param {string} articleId - The post id.
   * @returns {Promise<TArticle>} The post.
   */
  fetchArticleById: <TArticle = Post>(articleId: string) => Promise<TArticle>
  /**
   * Acknowledges a post. Fails fast (and reports via onError) when the CSRF
   * token is unavailable, and throws an ApiError on a non-OK response.
   * @param {string} id - The post id.
   * @returns {Promise<void>} Resolves when acknowledged.
   */
  acknowledgeArticle: (id: string) => Promise<void>
}
