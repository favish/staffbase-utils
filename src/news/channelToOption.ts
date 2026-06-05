import type { Channel } from '../types/content/Channel'
import type { DropdownOption } from '../types/content/DropdownOption'

/**
 * Maps a channel to a selector option, choosing its title.
 *
 * Prefers the title in `defaultLanguage` but falls back to any available
 * localized title, so a channel localized only in another language is never
 * dropped. Returns null when the channel has no usable title.
 * @param {Channel} channel - The channel from the API.
 * @param {string} defaultLanguage - The preferred locale for the title.
 * @returns {DropdownOption | null} The option, or null when untitled.
 */
export const channelToOption = (
  channel: Channel,
  defaultLanguage: string,
): DropdownOption | null => {
  const localization = channel?.config?.localization ?? {}
  const title =
    localization[defaultLanguage]?.title ||
    Object.values(localization).find((entry) => entry?.title)?.title

  return title ? { id: channel.id, title, spaceId: channel.spaceID } : null
}
