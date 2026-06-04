/**
 * The access-code / secret descriptor of a Staffbase user, returned by the user
 * read endpoints only for users that have one set.
 *
 * SENSITIVE: this is account-recovery material - never log it. Grounded in a
 * prod sweep: `secret` appeared on a small minority of users (~8 of 300). The
 * read shape never exposes the secret value itself; the bulk of items carried
 * just `expires` (a unix-millis expiry). A single-read additionally exposed a
 * `links.recovery` HATEOAS-style link, modeled here as optional.
 */
export interface UserSecret {
  expires: number
  links?: {
    recovery?: {
      href: string
      method: string
    }
  }
}
