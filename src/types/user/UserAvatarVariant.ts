/**
 * A single rendition of a user avatar (or profile header image) as returned by
 * the Staffbase user read endpoints (`GET /api/users`, `GET /api/users/{id}`).
 *
 * Grounded in an exhaustive prod sweep (2000 users): `url`, `format` and
 * `mimeType` are present on every observed variant; `format` and `mimeType` are
 * frequently `null` (an upload without a detected format). `width`/`height` are
 * always present on the `original` rendition but optional on `icon`/`thumb`
 * (absent on roughly half of them). `size` (bytes) is only ever present on the
 * `original` rendition.
 *
 * Distinct from the news `ArticleImageVariant`, which requires `width`/`height`
 * on all renditions; the user avatar shape leaves them optional.
 */
export interface UserAvatarVariant {
  url: string
  format: string | null
  mimeType: string | null
  width?: number
  height?: number
  size?: number
}
