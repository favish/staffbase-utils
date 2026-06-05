import { fetchAllPaginated } from '../api/fetchAllPaginated'
import type { Channel } from '../types/content/Channel'
import type { DropdownOption } from '../types/content/DropdownOption'
import type { NewsApiConfig } from '../types/news/NewsApiConfig'
import { channelToOption } from './channelToOption'

/**
 * Fetches every article channel as a selector option, paginated.
 *
 * Titles come from channelToOption (prefer default language, fall back to any),
 * so a channel localized only in another language is never silently dropped.
 * `spaceId` is always included for grouping/enrichment; `spaceName` is left to
 * fetchSpaceName so the list paints without blocking on per-space lookups.
 * @param {NewsApiConfig} config - The injected service configuration.
 * @returns {Promise<DropdownOption[]>} The channel options.
 */
export const fetchChannels = async (
  config: NewsApiConfig,
): Promise<DropdownOption[]> => {
  const channels = await fetchAllPaginated<Channel>(
    `${config.apiUrl}/channels?contentType=articles`,
    {
      includeDrafts: true,
      maxPages: config.maxPages,
      onError: config.onError,
    },
  )

  return channels
    .map((channel) => channelToOption(channel, config.defaultLanguage))
    .filter((option): option is DropdownOption => option !== null)
}
