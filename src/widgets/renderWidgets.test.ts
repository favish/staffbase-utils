import { renderWidgets } from './renderWidgets'

type WinStaffbase = {
  staffbase?: { content?: { widgetMgr?: unknown } }
}

const setManager = (widgetMgr: unknown): void => {
  ;(window as unknown as WinStaffbase).staffbase = { content: { widgetMgr } }
}

const clearManager = (): void => {
  delete (window as unknown as WinStaffbase).staffbase
}

// Builds a prototype-style manager constructor whose instances have no render.
const makePrototypeManager = (
  extract: jest.Mock,
  render: jest.Mock,
): unknown => {
  function WidgetMgr(): void {}
  WidgetMgr.prototype._extractWidgets = extract
  WidgetMgr.prototype._renderWidget = render
  return WidgetMgr
}

describe('renderWidgets', () => {
  afterEach(() => {
    clearManager()
    jest.restoreAllMocks()
  })

  it('returns no-container for a null container', async () => {
    await expect(renderWidgets(null)).resolves.toEqual({
      ok: false,
      reason: 'no-container',
    })
  })

  it('renders each widget via the prototype path', async () => {
    const render = jest.fn()
    setManager(
      makePrototypeManager(jest.fn().mockReturnValue([{}, {}]), render),
    )
    const el = document.createElement('div')

    await expect(renderWidgets(el, { retryDelay: 0 })).resolves.toEqual({
      ok: true,
      rendered: 2,
    })
    expect(render).toHaveBeenCalledTimes(2)
  })

  it('returns no-widgets when nothing is extracted', async () => {
    setManager(makePrototypeManager(jest.fn().mockReturnValue([]), jest.fn()))
    const el = document.createElement('div')

    await expect(
      renderWidgets(el, { maxRetries: 1, retryDelay: 0 }),
    ).resolves.toEqual({ ok: false, reason: 'no-widgets' })
  })

  it('returns manager-unavailable and reports once when the manager is missing', async () => {
    clearManager()
    const onError = jest.fn()
    const el = document.createElement('div')

    await expect(
      renderWidgets(el, { maxRetries: 1, retryDelay: 0, onError }),
    ).resolves.toEqual({ ok: false, reason: 'manager-unavailable' })
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      'manager-unavailable',
    )
  })

  it('swallows known internal render errors without rejecting or reporting', async () => {
    const render = jest.fn(() => {
      throw new TypeError('Cannot read properties of undefined (reading each)')
    })
    const onError = jest.fn()
    setManager(makePrototypeManager(jest.fn().mockReturnValue([{}]), render))
    const el = document.createElement('div')

    await expect(
      renderWidgets(el, { retryDelay: 0, onError }),
    ).resolves.toEqual({ ok: true, rendered: 0 })
    expect(onError).not.toHaveBeenCalled()
  })

  it('uses the host constructor render path when available', async () => {
    const render = jest.fn().mockResolvedValue(undefined)
    function Ctor(this: { render: () => Promise<void> }): void {
      this.render = render
    }
    setManager(Ctor)
    const el = document.createElement('div')

    await expect(renderWidgets(el, { retryDelay: 0 })).resolves.toEqual({
      ok: true,
      rendered: 0,
    })
    expect(render).toHaveBeenCalledWith(el)
  })

  it('cancels a superseded render with the same cancelKey', async () => {
    setManager(makePrototypeManager(jest.fn().mockReturnValue([{}]), jest.fn()))
    const el = document.createElement('div')

    const first = renderWidgets(el, { cancelKey: el, retryDelay: 0 })
    const second = renderWidgets(el, { cancelKey: el, retryDelay: 0 })

    await expect(first).resolves.toEqual({ ok: false, reason: 'cancelled' })
    await expect(second).resolves.toEqual({ ok: true, rendered: 1 })
  })
})
