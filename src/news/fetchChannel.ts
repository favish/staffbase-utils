import { fetchJson } from '../api/fetchJson'
import type { Channel } from '../types/content/Channel'
import type { NewsApiConfig } from '../types/news/NewsApiConfig'

/**
 * Fetches a single channel by id.
 * @param {NewsApiConfig} config - The injected service configuration.
 * @param {string} channelId - The channel id.
 * @returns {Promise<Channel>} The channel.
 */
export const fetchChannel = (
  config: NewsApiConfig,
  channelId: string,
): Promise<Channel> =>
  fetchJson<Channel>(`${config.apiUrl}/channels/${channelId}`)
