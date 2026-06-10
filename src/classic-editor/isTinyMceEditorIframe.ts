/**
 * Detects iframes hosting the classic editor's tinymce canvas. Support must be
 * registered ONLY there: every other same-origin iframe (the page-preview
 * iframe, Studio's device simulator) loads the real bundle and must keep its
 * registry free, or the host's defineBlock loses the race and the live widget
 * cannot mount (which can also corrupt content on save).
 *
 * tinymce marks its canvas iframe with the `tox-edit-area__iframe` class; the
 * `mce_<uid>_ifr` id pattern is the fallback across tinymce versions.
 * @param {HTMLIFrameElement} iframe - The iframe to test.
 * @returns {boolean} True when the iframe is a tinymce editor canvas.
 */
export const isTinyMceEditorIframe = (iframe: HTMLIFrameElement): boolean =>
  iframe.classList.contains('tox-edit-area__iframe') ||
  /^mce_[a-z0-9]+_ifr$/i.test(iframe.id)
