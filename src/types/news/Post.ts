import type { Channel } from '../content/Channel'
import type { ChannelLink } from '../content/ChannelLink'
import type { LocalizedContent } from '../content/LocalizedContent'
import type { PostAcknowledgements } from './PostAcknowledgements'
import type { PostAuthor } from './PostAuthor'
import type { PostComments } from './PostComments'
import type { PostLayout } from './PostLayout'
import type { PostLikes } from './PostLikes'
import type { PostSource } from './PostSource'

/**
 * A news post (article) as returned by the Staffbase read endpoints
 * (`GET /api/posts/{id}`, `GET /api/articles/{id}`, and the items of
 * `GET /api/channels/{id}/posts`).
 *
 * Curated, not machine-generated: the official News API spec declares its read
 * responses as `unknown`. Every field is grounded in real payloads. The
 * required/optional split was verified against an exhaustive sweep of 584 prod
 * posts across 32 channels: the fields below marked optional were genuinely
 * absent on some posts (e.g. `author` 465/584, `likes` 458/584,
 * `acknowledgements` only 1/584). Field names match the wire format verbatim
 * (`authorID`/`branchID`/`channelID` with a capital `ID`; `likes.total`, not a
 * flat `likesCount`; `acknowledgements` is `{ total, limit, offset }`, not
 * `{ isAcknowledged, total }`).
 *
 * `channel` is present only on the single-post reads (`/posts/{id}`,
 * `/articles/{id}`), never on the list items. `contents` reuses
 * {@link LocalizedContent}.
 */
export interface Post {
  id: string
  authorID?: string
  author?: PostAuthor
  creatorId?: string
  branchID: string
  channelID: string
  channel?: Channel
  contents: Record<string, LocalizedContent>
  notificationChannels: string[] | null
  highlighted: boolean
  highlightingAllowed: boolean
  weight: number
  hashtags: string[]
  contentType: string
  acknowledgingAllowed: boolean
  acknowledgingEnabled: boolean
  acknowledgements?: PostAcknowledgements
  commentingAllowed: boolean
  commentingEnabled: boolean
  comments?: PostComments
  layout: PostLayout
  likingAllowed: boolean
  likingEnabled: boolean
  likes?: PostLikes
  sharingAllowed: boolean
  sharingEnabled: boolean
  internalSharingAllowed: boolean
  internalSharingEnabled: boolean
  externalSharingAllowed: boolean
  externalSharingEnabled: boolean
  useBigFeedMedia: boolean
  planned: string | null
  campaignId?: string
  draftId?: string
  source?: PostSource
  created: string
  updated: string
  published: string
  unpublished?: string
  entityType: string
  links: Record<string, ChannelLink>
  rights: string[]
}
