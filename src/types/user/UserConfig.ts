/**
 * Per-user configuration block returned by the Staffbase user read endpoints.
 *
 * Grounded in a prod sweep (2000 users): every user carried a `config` object
 * with a `locale` string (e.g. `en_US`). Matches the spec
 * `SingleUserWithAvatar.config` shape.
 */
export interface UserConfig {
  locale: string
}
