import { logRemovedEmbeds } from './logRemovedEmbeds'

describe('logRemovedEmbeds', () => {
  afterEach(() => jest.restoreAllMocks())

  it('warns when a custom-element embed was removed', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    logRemovedEmbeds([{ element: document.createElement('news-teaser') }])
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toContain('news-teaser')
  })

  it('does not warn for removed scripts, standard elements or attributes', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    logRemovedEmbeds([
      { element: document.createElement('script') },
      { element: document.createElement('div') },
      { attribute: { name: 'onclick' } },
    ])
    expect(warn).not.toHaveBeenCalled()
  })

  it('does nothing for an empty removed list', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    logRemovedEmbeds([])
    expect(warn).not.toHaveBeenCalled()
  })
})
