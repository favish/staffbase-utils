/**
 * The role descriptor of a Staffbase user, as embedded in the user read
 * endpoints.
 *
 * Grounded in a prod sweep (2000 users): every user carried a `role` object
 * with a `type` string (e.g. `admin`, `user`). Matches the spec
 * `SingleUserWithAvatar.role` shape.
 */
export interface UserRole {
  type: string
}
