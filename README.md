# `DEVELOPER_GUIDE.md`

Save this at the repo root as `DEVELOPER_GUIDE.md`.

```md
# Squeez Mobile — Developer Guide

React Native monorepo (Expo + npm workspaces). This doc is the "how do I
actually do X" reference for anyone working in this repo.

---

## 1. What's Where

```
apps/
└── mobile/                 # The Expo app — routes + shell only, no feature logic

packages/
├── feature-dashboard/      # Feature packages (one per product domain)
├── feature-navigation/     # Drawer + tabs + mode switching
├── feature-notifications/  # (planned)
├── shared-types/           # Pure TS types, no runtime, no deps
├── shared-config/          # Env, route path constants
├── shared-store/           # Zustand slices (authStore, uiStore)
├── shared-lib/             # API client, hooks
└── shared-ui/              # Themed components (Button, Card, Table, Screen, …)
```

Every folder under `apps/` and `packages/` is its own npm workspace package named
`@squeez/<folder-name>`. Import across packages by that name — never with a
relative path that reaches outside your own package.

**Layering rule (the one that matters):**

```
apps/mobile  →  feature-*  →  shared-*
```

- `shared-*` must never import `feature-*` or `apps/*`
- `feature-*` must never import another `feature-*`
- Anything two features need → promote it to a `shared-*` package

---

## 2. Prerequisites

| Tool | Version | Why |
|---|---|---|
| Node | 24.x | Matches `engines` in root `package.json` |
| Java | 17 (JDK) | React Native 0.86 requires 17, not 21/25 |
| Android Studio | latest | For emulator + SDK |
| Android emulator | any API 33+ | Run the app |

Check Java:
```powershell
java -version   # must print 17.x
```

---

## 3. Commands — From the Repo Root

All commands run from `C:\RNM` unless noted. Never `cd` into a package to run
these.

| Command | What it does |
|---|---|
| `npm install` | Install everything + link workspace packages. Run after adding any new package or dependency. |
| `npm run dev` | Start the Metro dev server for `apps/mobile`. |
| `npm run typecheck` | Type-check every package. |
| `npm run lint` | ESLint across the repo (once configured). |
| `npm run format` | Prettier — writes changes to disk. |
| `npm run format:check` | Prettier — reports only. |

### First-time setup

```powershell
npm install
```

### Run the app on the Android emulator

Start the emulator first (via Android Studio → Device Manager), then:

```powershell
npm run dev
```

In the Metro terminal, press `a`. The app builds and installs on the emulator.

### Rebuild after adding a native package

Pure JS packages don't need this. Packages with native code (Reanimated,
Gesture Handler, expo-notifications, etc.) do:

```powershell
cd C:\RNM\apps\mobile
npx expo run:android
```

Takes 5–15 min the first time, ~30 s after. **Do not Ctrl+C during Gradle
download.**

---

## 4. Creating a New Feature Package

Feature packages hold domain logic + screens. They never live inside `apps/`.

### Steps

1. Create `packages/feature-<name>/src/`
2. Create `package.json`:
   ```json
   {
     "name": "@squeez/feature-<name>",
     "version": "0.0.0",
     "private": true,
     "type": "module",
     "main": "./src/index.ts",
     "types": "./src/index.ts",
     "scripts": { "typecheck": "tsc --noEmit" },
     "dependencies": {
       "@squeez/shared-config": "*",
       "@squeez/shared-types": "*",
       "@squeez/shared-ui": "*"
     }
   }
   ```
3. Create `tsconfig.json` (copy verbatim from any existing package):
   ```json
   {
     "extends": "../../tsconfig.base.json",
     "include": ["src"]
   }
   ```
4. Write your screens/components in `src/`
5. Create `src/index.ts` with named exports:
   ```ts
   export { MyScreen } from './MyScreen'
   ```
6. Add the dep to `apps/mobile/package.json`:
   ```json
   "@squeez/feature-<name>": "*"
   ```
7. Run `npm install` from root
8. Create the route file `apps/mobile/app/<name>.tsx`:
   ```tsx
   import { MyScreen } from '@squeez/feature-<name>'
   export default function Route() { return <MyScreen /> }
   ```
9. Add it to the nav list: edit `packages/feature-navigation/src/drawerItems.ts`
10. Verify: `npm run typecheck` then `npm run dev`

### Rules

- **Only list `@squeez/*` packages** in `dependencies`. External packages
  (react, react-native, axios, zustand) resolve from root or from the app.
- **Named exports only** in `src/index.ts`.
- **Never import from another feature package.**

---

## 5. Creating a New Shared Package

Only when something is needed by **two or more** feature packages.

Prefer extending an existing shared package over creating a new one:

| Kind of code | Where it goes |
|---|---|
| Pure types | `shared-types` |
| Route paths, env config | `shared-config` |
| Zustand slice | `shared-store` |
| API client, hooks | `shared-lib` |
| Themed components | `shared-ui` |

Same 10 steps as a feature package, but add the dep to the consuming feature
packages instead of only the app.

---

## 6. Using Shared Packages

```tsx
import { Button, Card, Screen, ThemedText, useTheme } from '@squeez/shared-ui'
import { useAuthStore, useUiStore } from '@squeez/shared-store'
import { routes, env } from '@squeez/shared-config'
import { apiClient } from '@squeez/shared-lib'
import type { User } from '@squeez/shared-types'
```

See `packages/shared-ui/SHARED_UI.md` for the full component reference.

---

## 7. Theming

Four themes: `light`, `dark`, `blue`, `orange`.

- **State** lives in `shared-store`'s `uiStore` (field `theme`).
- **Tokens** live in `shared-ui/src/theme/`.
- **Reading colors** — `const { theme } = useTheme()`, then use tokens like
  `theme.text.primary`, `theme.bg.surface`, `theme.brand.primary`.
- **Switching themes** — `useUiStore((s) => s.setTheme)('dark')`, or via the
  Settings screen.

**Never hardcode a color in a component.** If a color appears twice, it belongs
in the theme.

---

## 8. Navigation

- **Drawer** and **Tabs** both read from `packages/feature-navigation/src/drawerItems.ts`
- Mode state lives in `uiStore.navigationMode` (`'drawer'` | `'tabs'`)
- Switch mode from the Settings screen
- `apps/mobile/app/_layout.tsx` mounts `<NavigationRoot />` which picks the
  navigator based on `uiStore`

### Adding a screen to the nav

1. Create `apps/mobile/app/<name>.tsx` (route file)
2. Add one entry to `packages/feature-navigation/src/drawerItems.ts`:
   ```ts
   { name: '<name>', label: 'Label', icon: 'icon-outline' }
   ```
3. Add the icon name to the `DrawerItem['icon']` union if it's new

The screen appears in both drawer and tabs automatically.

---

## 9. Debugging

- **Metro terminal keys** aren't reliable on Windows. Use the emulator's
  `Ctrl+M` → **Open DevTools** instead.
- **Full debugger (sources, breakpoints):** Expo Go on Android has a bug that
  breaks the debugger. Use a **development build** (`npx expo run:android`) —
  the debugger works there.
- **Console logs** appear in the Metro terminal directly.
- **Network tab** in DevTools may be broken under Expo Go. Same fix: dev build.

---

## 10. Testing

Tests are not yet configured. When you add them, Jest + `jest-expo` is the
recommended stack for React Native. See `packages/shared-*/src/*.test.ts` for
the pattern when they exist.

---

## 11. Common Pitfalls

| Symptom | Fix |
|---|---|
| `Unable to resolve "../../App"` | `main` in `apps/mobile/package.json` must be `"expo-router/entry"` |
| Cannot find module `@squeez/x` | Run `npm install` from root; the workspace symlink is missing |
| TS error on `__DEV__` in a non-RN package | Declare `const __DEV__: boolean` locally or avoid the global |
| App stuck on old code after a config change | `npx expo start --clear` from `apps/mobile` |
| Native module missing at runtime | `npx expo run:android` from `apps/mobile` — JS reload isn't enough |
| Drawer/tabs colors don't update | Component isn't using `useTheme()` — read from the theme, don't hardcode |
| Metro fails after `.gitignore` changes | Restart `expo start`; Metro caches the file tree |

---

## 12. Git

```powershell
git status
git add .
git commit -m "message"
```

Ignored: `node_modules`, `.expo`, `dist`, `android/`, `ios/`, `coverage`,
`*.tsbuildinfo`.

If a new file doesn't show up in `git status`, it's matching a `.gitignore`
rule. Find out which one:
```powershell
git check-ignore -v path\to\file
```

---

## 13. Referencing the Design Docs

- **This file** — day-to-day commands, patterns, pitfalls
- **`packages/shared-ui/SHARED_UI.md`** — component API reference
- **`packages/shared-ui/src/theme/`** — theme structure
- **`packages/feature-navigation/src/`** — navigation implementation

---

## 14. Quick Reference

| I want to… | Do this |
|---|---|
| Start the app | `npm run dev`, then press `a` |
| Rebuild native code | `cd apps/mobile && npx expo run:android` |
| Add a feature package | Section 4 |
| Add a shared package | Section 5 |
| Use a shared component | `import { Button } from '@squeez/shared-ui'` |
| Add a new screen to nav | Section 8 |
| Switch themes | Settings screen, or `useUiStore((s) => s.setTheme)('dark')` |
| Switch nav mode | Settings screen, or `useUiStore((s) => s.setNavigationMode)('tabs')` |
| Fix a package not resolving | `npm install` from root |
| Check my work | `npm run typecheck && npm run format:check` |
```

---

Save it at `C:\RNM\DEVELOPER_GUIDE.md`. Update it as the repo grows — when you add Jest, push notifications, or CI, append a section rather than starting a new file.