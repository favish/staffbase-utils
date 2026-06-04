/**
 * Reads the active language from the Staffbase editor's selected language tab
 * (`[aria-selected="true"]` with a `data-testid` suffixed by the language code).
 * Returns null when no tab is active or there is no DOM, so callers can fall back.
 * @returns {string | null} The detected editor language, or null.
 */
export const detectEditorLanguage = (): string | null => {
  if (typeof document === 'undefined') return null

  const activeTab = document.querySelector('[aria-selected="true"]')
  const testId = activeTab?.getAttribute('data-testid')

  return testId?.split('-').pop() ?? null
}
