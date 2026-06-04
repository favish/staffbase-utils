import type { PostAuthorAvatar } from './PostAuthorAvatar'

/**
 * The author of a news post, as embedded in the post read responses.
 *
 * Grounded in live prod reads; the spec does not document this shape. `avatar`
 * is optional because 39 of 465 authored prod posts had an author with no
 * avatar.
 */
export interface PostAuthor {
  id: string
  firstName: string
  lastName: string
  entityType: string
  avatar?: PostAuthorAvatar
}
