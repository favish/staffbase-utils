# @favish/staffbase-utils

Shared internal/host utilities for Staffbase widgets. Tree-shakeable subpath
modules; import only what you use.

## Modules

- `@favish/staffbase-utils/log` — `logError`, `logWarn`, `logDebug`, `setLoggingEnabled`

## Logging

The library never reads env flags directly (webview-safe). Enable console output
once at widget startup with your own flag:

```ts
import { setLoggingEnabled } from '@favish/staffbase-utils/log'

setLoggingEnabled(import.meta.env.VITE_SHOW_CONSOLE_ERRORS === 'true')
```

Disabled by default, so production stays silent.
