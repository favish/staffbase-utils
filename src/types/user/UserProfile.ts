import type { UserAvatar } from './UserAvatar'

/**
 * The profile block of a Staffbase user, returned by the user read endpoints.
 *
 * The Staffbase user model lets each tenant define arbitrary profile fields, so
 * this is an open record rather than a fixed shape. Grounded in a prod sweep
 * (2000 users): the great majority of fields are tenant-defined string
 * attributes (department/job/location codes, etc.), so the index signature
 * carries `string`. Two structured fields recur and are typed explicitly:
 * `avatar` and `profileHeaderImage`, both {@link UserAvatar} rendition sets.
 *
 * The well-known string fields below mirror the spec `UserProfile` (the values
 * the platform mirrors from the top-level user fields). All are optional - they
 * appear only when populated for a given user/tenant.
 */
export interface UserProfile {
  avatar?: UserAvatar
  profileHeaderImage?: UserAvatar
  firstName?: string
  lastName?: string
  department?: string
  location?: string
  position?: string
  phoneNumber?: string
  publicEmailAddress?: string
  [field: string]: string | UserAvatar | undefined
}
