/**
 * A platform user entity as embedded in a group's single-read response, used
 * both for `owner` and for each item of `users.data`.
 *
 * Grounded in a live prod sweep (306 user entities across 6 single reads). The
 * required/optional split below reflects observed presence counts: the core
 * identity and account fields were present on 306/306, while `avatar`
 * (276/306), `recoveryCode` (11/306), `secret` (20/306) and `deactivatedAt`
 * (2/306) were genuinely absent on some users. `mandatoryGroupIDs` and
 * `phoneNumber` were always `null` in the sweep; `department`, `location` and
 * `position` were string-or-null.
 *
 * Nested platform sub-objects (`avatar`, `config`, `creation`, `profile`,
 * `recoveryCode`, `role`, `secret`, `userName`) are full entity dumps and are
 * typed as opaque records: their inner shapes are platform-controlled, vary by
 * tenant (`profile` is a free-form custom-field map), and are not part of the
 * contract this read type guarantees. The official groups spec does not
 * document this user shape at all.
 */
export interface GroupUser {
  id: string
  firstName: string
  lastName: string
  entityType: string
  status: string
  activated: string
  branchID: string
  branchRole: string
  externalID: string
  publicEmailAddress: string
  department: string | null
  location: string | null
  position: string | null
  mandatoryGroupIDs: string[] | null
  phoneNumber: string | null
  groupIDs: string[]
  tags: string[]
  emails: Record<string, unknown>[]
  config: Record<string, unknown>
  creation: Record<string, unknown>
  profile: Record<string, unknown>
  role: Record<string, unknown>
  userName: Record<string, unknown>
  avatar?: Record<string, unknown>
  recoveryCode?: Record<string, unknown>
  secret?: Record<string, unknown>
  deactivatedAt?: string
  created: string
  updated: string
}
