import type { UserAvatarVariant } from './UserAvatarVariant'

/**
 * The rendition set of a user avatar (or profile header image) returned by the
 * Staffbase user read endpoints.
 *
 * Grounded in a prod sweep (6000 users): when present, the `avatar` object is
 * either the full rendition set (`original`/`icon`/`thumb`, sometimes with
 * `publicID`) or an empty object `{}` (a placeholder for users with no uploaded
 * avatar). All members are therefore optional. `publicID` accompanies only the
 * subset created through the newer upload pipeline. Each rendition reuses
 * {@link UserAvatarVariant}.
 */
export interface UserAvatar {
  original?: UserAvatarVariant
  icon?: UserAvatarVariant
  thumb?: UserAvatarVariant
  publicID?: string
}
