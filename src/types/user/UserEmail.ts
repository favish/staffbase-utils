/**
 * One email entry of a Staffbase user, as embedded in the `emails` array of the
 * user read endpoints.
 *
 * Grounded in a full-population prod sweep (49,215 users): entries carry
 * `primary` and `providerID`, where `providerID` identifies the source that
 * supplied the address (e.g. the SSO/identity provider or `staffbase`). `value`
 * is optional - one entry in the whole population lacked it.
 */
export interface UserEmail {
  value?: string
  primary: boolean
  providerID: string
}
