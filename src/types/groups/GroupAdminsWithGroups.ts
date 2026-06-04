import type { ChannelLink } from '../content/ChannelLink'

/**
 * The `adminsWithGroups` object on a group's single-read response.
 *
 * Grounded in a live prod sweep (6 single reads): `links` (a HAL link map) and
 * `rights` (a string array) were present on 6/6, while `groups` (an embedded
 * paginated collection of `{ total, data }`) appeared on only 1/6 and is
 * therefore optional. Present only on single reads, never on the list items.
 * The `groups` payload is an embedded collection of platform entities and is
 * typed as an opaque record. The official groups spec does not document this
 * shape.
 */
export interface GroupAdminsWithGroups {
  links: Record<string, ChannelLink>
  rights: string[]
  groups?: Record<string, unknown>
}
