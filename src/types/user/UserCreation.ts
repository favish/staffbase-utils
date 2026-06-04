/**
 * Provenance of a Staffbase user account, returned by the user read endpoints.
 *
 * Grounded in a prod sweep: `type` was present on every user (e.g. how the
 * account was created). `invitorID`/`invitorType` identify the actor that
 * invited the user and were present on almost every account (absent only on
 * users created without an explicit inviter). `ssoConfigID` appears only on
 * users provisioned through an SSO configuration. Not documented by the spec.
 */
export interface UserCreation {
  type: string
  invitorID?: string
  invitorType?: string
  ssoConfigID?: string
}
