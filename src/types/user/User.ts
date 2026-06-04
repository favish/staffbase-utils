import type { UserAvatar } from './UserAvatar'
import type { UserConfig } from './UserConfig'
import type { UserCreation } from './UserCreation'
import type { UserEmail } from './UserEmail'
import type { UserName } from './UserName'
import type { UserProfile } from './UserProfile'
import type { UserRecoveryCode } from './UserRecoveryCode'
import type { UserRole } from './UserRole'
import type { UserSecret } from './UserSecret'

/**
 * A Staffbase user as returned by the user read endpoints (`GET /api/users`
 * list items and `GET /api/users/{id}`).
 *
 * Curated, not machine-generated. The official user OpenAPI spec carries two
 * read shapes and the runtime endpoint matches NEITHER cleanly: it overlaps the
 * spec `User` schema on only 7 of 11 fields, but matches `SingleUserWithAvatar`
 * on all 20 of its fields AND returns extra fields the spec never documents
 * (`branchRole`, `creation`, `entityType`, `recoveryCode`, `secret`,
 * `userName`, `tags`, plus structured `emails`/`userName` objects). This type
 * is therefore grounded in an exhaustive prod sweep rather than codegen.
 *
 * Required/optional was verified against a sweep of the full prod population
 * (49,215 users) plus single-reads: `avatar` was absent on ~3/300 sampled,
 * `secret` on ~8/300, `recoveryCode` on ~3/300. The full-population sweep also
 * showed `userName` and `groupIDs` missing on some users, `publicEmailAddress`
 * occasionally `null`, and a long tail of rare omissions (`externalID` 5/49215,
 * `tags` 9/49215) - all typed optional accordingly.
 *
 * Wire-format notes (verbatim): `externalID` uses a capital `ID`; `userName`
 * and `emails[]` are objects, not bare strings; `recoveryCode`/`secret` are
 * objects on read (strings on write); `department`/`location`/`position` and
 * `publicEmailAddress` are nullable; `phoneNumber` and `mandatoryGroupIDs` were
 * observed only as `null` across the whole population (typed as a union with
 * the spec/profile string/array form).
 */
export interface User {
  id: string
  firstName: string
  lastName: string
  userName?: UserName
  emails: UserEmail[]
  publicEmailAddress: string | null
  phoneNumber: string | null
  externalID?: string
  entityType: string
  status: string
  activated: string
  created: string
  updated: string
  creation: UserCreation
  role: UserRole
  branchRole: string
  config: UserConfig
  profile: UserProfile
  department: string | null
  location: string | null
  position: string | null
  groupIDs?: string[]
  mandatoryGroupIDs: string[] | null
  tags?: string[]
  avatar?: UserAvatar
  secret?: UserSecret
  recoveryCode?: UserRecoveryCode
}
