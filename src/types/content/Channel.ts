import type { ChannelLink } from './ChannelLink'

/**
 * Partial shape of a Staffbase content channel as returned by the channels API.
 *
 * Shared verbatim by the alerts, unacknowledged-bulletins and global-content
 * widgets. The smart-search widget consumes a different (search-API) channel
 * shape and keeps its own type. Marked partial because the platform may add
 * fields; only the documented subset the widgets rely on is typed here.
 */
export interface Channel {
  pluginID: string
  menuFolderIDs: string[]
  defaultMenuFolderId: string
  config: {
    localization: Record<
      string,
      {
        title: string
        description: string | null
      }
    >
    sidebarVisible: boolean
    showPageBackground: boolean
    showAdminActions: boolean
  }
  availableInPublicArea: boolean
  contentType: string
  notificationChannelsAllowed: string[] | null
  notificationChannelsDefault: string[]
  postCount: number
  id: string
  spaceID: string
  visibleInPublicArea: boolean
  displayAuthor: boolean
  acknowledgingAllowed: boolean
  commentingAllowed: boolean
  highlightingAllowed: boolean
  layout: {
    primaryMedia: string
  }
  likingAllowed: boolean
  sharingAllowed: boolean
  internalSharingAllowed: boolean
  externalSharingAllowed: boolean
  lastPostPublishedAt: string
  commentingEnabledDefault: boolean
  highlightingEnabledDefault: boolean
  likingEnabledDefault: boolean
  sharingEnabledDefault: boolean
  acknowledgingEnabledDefault: boolean
  internalSharingEnabledDefault: boolean
  externalSharingEnabledDefault: boolean
  published: string
  created: string
  entityType: string
  updated: string
  links: {
    preview: ChannelLink
    create_post: ChannelLink
    move: ChannelLink
    accessors: ChannelLink
    available_news_pages: ChannelLink
    get_posts: ChannelLink
    menu_items: ChannelLink
    update: ChannelLink
    feeds: ChannelLink
    delete: ChannelLink
    users: ChannelLink
    update_news_pages: ChannelLink
  }
  rights: string[]
}
