import type { ChannelLinkParameter } from './ChannelLinkParameter'

/**
 * A single HAL link on a channel (method + href, with optional parameter and
 * form descriptors). Used for each entry of a channel's `links` map.
 */
export interface ChannelLink {
  method: string
  href: string
  parameters?: Record<string, ChannelLinkParameter>
  form?: ChannelLinkParameter[]
}
