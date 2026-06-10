/**
 * Detects Staffbase's Classic Editor URL gate (?isClassic=true). Classic-editor
 * support runs ONLY here: the modern Studio editor and the on-page editor define
 * the widget themselves, so running there would double-define the element and
 * could break save.
 * @returns {boolean} True when the current page is the Classic Editor.
 */
export const isClassicEditorPage = (): boolean => {
  try {
    return (
      new URLSearchParams(window.location.search).get('isClassic') === 'true'
    )
  } catch {
    return false
  }
}
