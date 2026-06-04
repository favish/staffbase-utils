/**
 * Strips a leading Staffbase link prefix (`/deeplink/` or `/openlink/`) from a
 * URL pathname, leaving the canonical in-app path.
 * @param {string} path - The URL pathname.
 * @returns {string} The path without the Staffbase prefix.
 */
export const stripStaffbaseLinkPrefix = (path: string): string => {
  if (path.startsWith('/deeplink/'))
    return `/${path.slice('/deeplink/'.length)}`
  if (path.startsWith('/openlink/'))
    return `/${path.slice('/openlink/'.length)}`
  return path
}
