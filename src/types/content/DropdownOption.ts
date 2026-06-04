/**
 * Option shape for channel/article selector dropdowns.
 *
 * `spaceName` and `spaceId` are optional enrichment used by widgets that group
 * options by space; widgets that do not group simply omit them. This is the
 * superset of the alerts (id/title) and unacknowledged-bulletins (+space)
 * variants.
 */
export interface DropdownOption {
  id: string
  title: string
  /** Optional space name for display in selectors. */
  spaceName?: string
  /** Optional space id for enrichment. */
  spaceId?: string
}
