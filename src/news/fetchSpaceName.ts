import { fetchJson } from '../api/fetchJson'
import type { NewsApiConfig } from '../types/news/NewsApiConfig'

/**
 * Process-lifetime memo of resolved space names, keyed by API URL + space id so
 * distinct hosts never collide. Avoids re-fetching the same space across the
 * many channels that share it.
 */
const spaceNameCache = new Map<string, string>()

/**
 * Resolves a space's display name by id, caching the result.
 * @param {NewsApiConfig} config - The injected service configuration.
 * @param {string} spaceId - The space id.
 * @returns {Promise<string>} The space name (empty string when unknown).
 */
export const fetchSpaceName = async (
  config: NewsApiConfig,
  spaceId: string,
): Promise<string> => {
  const key = `${config.apiUrl}|${spaceId}`
  const cached = spaceNameCache.get(key)
  if (cached !== undefined) return cached

  const space = await fetchJson<{ id: string; name: string }>(
    `${config.apiUrl}/spaces/${spaceId}`,
  )
  const name = space?.name ?? ''
  spaceNameCache.set(key, name)

  return name
}
