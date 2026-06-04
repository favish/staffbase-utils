import type { GroupConfigLocalization } from './GroupConfigLocalization'

/**
 * A group's `config` object as returned by the read endpoints
 * (`GET /api/groups`, `GET /api/groups/{id}`).
 *
 * Grounded in a live prod sweep of all 45 groups: every group's `config`
 * carried exactly two keys, `localization` (a per-locale map keyed by locale
 * code) and `showInOverview` (boolean), both present on 45/45 list items and
 * 6/6 single reads. The head-start hint of `icon`/`imageUrl`/`link` was not
 * observed on any group and is therefore not modeled.
 */
export interface GroupConfig {
  localization: Record<string, GroupConfigLocalization>
  showInOverview: boolean
}
