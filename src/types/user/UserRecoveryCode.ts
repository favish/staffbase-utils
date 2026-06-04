/**
 * The account-recovery code descriptor of a Staffbase user, returned by the
 * user read endpoints only for users that have one set.
 *
 * SENSITIVE: `plain` is the recovery code value - never log it. Grounded in a
 * prod sweep: `recoveryCode` appeared on a small minority of users (~3 of 300),
 * always carrying `plain`; `expires` (a unix-millis expiry) was present on a
 * subset.
 *
 * Note: on the write side (`CreateUser`/`UpdateUser`) `recoveryCode` is a plain
 * string; the read shape is this object.
 */
export interface UserRecoveryCode {
  plain: string
  expires?: number
}
