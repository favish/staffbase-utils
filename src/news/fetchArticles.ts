import { fetchAllPaginated } from '../api/fetchAllPaginated'
import type { FetchArticlesOptions } from '../types/news/FetchArticlesOptions'
import type { NewsApiConfig } from '../types/news/NewsApiConfig'
import type { Post } from '../types/news/Post'
import { fetchChannel } from './fetchChannel'
import { keepPublishedArticle } from './keepPublishedArticle'

/**
 * Fetches a channel's posts, paginated and (by default) filtered to the
 * currently-published window.
 *
 * `scope` selects the client or channel posts endpoint. With
 * `requireChannelPublished`, an unpublished channel short-circuits to an empty
 * list. With `includeUnpublished`, the per-post publication filter is skipped
 * (used by configuration selectors that list every article).
 * @template TArticle The post shape returned (defaults to Post).
 * @param {NewsApiConfig} config - The injected service configuration.
 * @param {string} channelId - The channel id.
 * @param {FetchArticlesOptions} [options] - Endpoint and filtering options.
 * @returns {Promise<TArticle[]>} The posts.
 */
export const fetchArticles = async <
  TArticle extends Pick<Post, 'published' | 'unpublished'> = Post,
>(
  config: NewsApiConfig,
  channelId: string,
  options: FetchArticlesOptions = {},
): Promise<TArticle[]> => {
  const {
    scope = 'channel',
    requireChannelPublished = false,
    includeUnpublished = false,
    includeDrafts = false,
  } = options

  if (requireChannelPublished) {
    const channel = await fetchChannel(config, channelId)
    const publishedDate = channel.published ? new Date(channel.published) : null
    if (!publishedDate || new Date() < publishedDate) return []
  }

  const segment =
    scope === 'client'
      ? `client/channels/${channelId}/posts`
      : `channels/${channelId}/posts`

  return fetchAllPaginated<TArticle>(`${config.apiUrl}/${segment}`, {
    includeDrafts,
    maxPages: config.maxPages,
    onError: config.onError,
    mapItem: includeUnpublished ? undefined : keepPublishedArticle,
  })
}
