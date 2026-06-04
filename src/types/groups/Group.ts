import type { ChannelLink } from '../content/ChannelLink'
import type { GroupAccessors } from './GroupAccessors'
import type { GroupAdminsWithGroups } from './GroupAdminsWithGroups'
import type { GroupConfig } from './GroupConfig'
import type { GroupUser } from './GroupUser'
import type { GroupUsers } from './GroupUsers'

/**
 * A group as returned by the Staffbase read endpoints (`GET /api/groups` and
 * `GET /api/groups/{id}`).
 *
 * Curated, not machine-generated: the official groups OpenAPI `Group` schema
 * does NOT match the runtime (it models the v2026 management API with
 * `externalId`/`inclusions`/`exclusions`; only `id`/`name`/`type` overlap).
 * Every field below is grounded in a live prod sweep of all 45 groups (45 list
 * items + 6 single reads). Group membership is PII; only key names and types
 * were extracted, never values.
 *
 * Field names match the wire format verbatim, including the capitalised `ID`
 * suffix on `accessorIDs`, `adminIDs` and `ownerID`. The required/optional
 * split reflects observed presence: `accessorIDs`/`adminIDs`/`ownerID`/
 * `ownerType`/`config`/`links`/`rights` were present on 45/45 list items, while
 * `accessors`, `owner`, `adminsWithGroups` and `users` were present only on the
 * single reads (6/6) and never on the list items, so they are optional.
 * `adminIDs` was an empty array for some groups but always present.
 *
 * `links` reuses {@link ChannelLink}: every entry was `{ method, href }`, some
 * also carrying the optional `parameters`/`form` descriptors, matching the
 * channel link shape exactly.
 */
export interface Group {
  id: string
  name: string
  type: string
  accessorIDs: string[]
  adminIDs: string[]
  ownerID: string
  ownerType: string
  config: GroupConfig
  entityType: string
  links: Record<string, ChannelLink>
  rights: string[]
  accessors?: GroupAccessors
  owner?: GroupUser
  adminsWithGroups?: GroupAdminsWithGroups
  users?: GroupUsers
}
