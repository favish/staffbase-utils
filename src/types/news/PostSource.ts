/**
 * Syndication source of a news post, present on imported/sourced posts (116 of
 * 584 prod posts). All fields observed as strings in prod.
 */
export interface PostSource {
  id: string
  name: string
  type: string
  externalLink: string
}
