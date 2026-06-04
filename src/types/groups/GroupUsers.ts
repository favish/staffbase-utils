import type { ChannelLink } from '../content/ChannelLink'
import type { GroupUser } from './GroupUser'

/**
 * The `users` object on a group's single-read response: a paginated collection
 * of the group's members.
 *
 * Grounded in a live prod sweep (6/6 single reads): the pagination envelope
 * (`total`, `limit`, `offset`), the `data` array of {@link GroupUser} members,
 * the `links` HAL map and the `rights` string array were all present on 6/6.
 * Present only on single reads (`GET /api/groups/{id}`), never on the list
 * items. The official groups spec does not document this shape.
 */
export interface GroupUsers {
  total: number
  limit: number
  offset: number
  data: GroupUser[]
  links: Record<string, ChannelLink>
  rights: string[]
}
