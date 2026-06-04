/**
 * The structured user name returned by the Staffbase user read endpoints.
 *
 * Unlike the write side (where `userName` is a plain string), the read shape is
 * an object. Grounded in a prod sweep (2000 users): every user carried both
 * `value` and `providerID`, where `providerID` identifies the source that
 * supplied the user name (e.g. the SSO/identity provider or `staffbase`).
 */
export interface UserName {
  value: string
  providerID: string
}
