---
name: Managed artifact ports
description: Replit-specific port and base-path behavior for this workspace's artifact services.
---

Managed artifact workflows provide service-specific `PORT` and `BASE_PATH` values automatically. A standalone Vite build does not receive those workflow values, so commands that load an artifact Vite config must provide the expected environment explicitly.

**Why:** The frontend Vite config intentionally requires `PORT`; this protects artifact routing at runtime but makes an unscoped root build fail before Vite starts.

**How to apply:** Use the managed workflow for preview, or provide the artifact's configured port and base path when running its build directly.