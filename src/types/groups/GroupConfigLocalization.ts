/**
 * One per-locale entry of a group's `config.localization` map.
 *
 * Grounded in a live prod sweep of all 45 groups (51 localization entries
 * across list + single reads): every entry carried exactly one key, `title`,
 * always a string. The spec does not document this shape (the official groups
 * `Group` schema models a different management API and does not match the
 * runtime at all).
 */
export interface GroupConfigLocalization {
  title: string
}
