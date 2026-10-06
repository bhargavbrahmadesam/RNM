Yes — I have what I need. Your generator config covers `feature-package` and `shared-package`, references `templates/*.hbs` files, and uses `properCase` plus a custom `readableTitle` helper. That's enough to document.

One quick confirmation before I write: **is there a `turbo.json` file at root?** If yes, I'll document the pipeline. If no, I'll skip that part.

Assuming yes (or at least that `turbo gen` works), here's the updated guide.

---

# `DEVELOPER_GUIDE.md`

Replace your existing file with this:

```md
# Squeez Mobile — Developer Guide

React Native monorepo (Expo + npm workspaces + Turborepo for scaffolding).
Single reference for anyone working in this repo: what's where, why, and how to
do common tasks.

---

## 1. What's Where

```
apps/
└── mobile/                 # The Expo app — routes + shell only, no feature logic

packages/
├── feature-dashboard/      # Feature packages (one per product domain)
├── feature-navigation/     # Drawer + tabs + mode switching
├── shared-types/           # Pure TS types, no runtime, no deps
├── shared-config/          # Env, route path constants
├── shared-store/           # Zustand slices (authStore, uiStore)
├── shared-lib/             # API client, hooks
└── shared-ui/              # Themed components + theme system

turbo/
└── generators/
    ├── config.ts           # Plop config — defines feature-package and shared-package generators
    └── templates/
        ├── feature-package/   # .hbs templates used by the feature generator
        └── shared-package/    # .hbs templates used by the shared generator
```

Every folder under `apps/` and `packages/` is its own npm workspace package
named `@squeez/<folder-name>`. Import across packages by that name — never with
a relative path that reaches outside your own package.

**The layering rule:**

```
apps/mobile  →  feature-*  →  shared-*
```

- `shared-*` must never import `feature-*` or `apps/*`
- `feature-*` must never import another `feature-*`
- Anything two features need → promote it to a `shared-*` package

---

## 2. The Mental Model — Why It's Shaped This Way

### Why a monorepo

Started as a single Expo app. Worked, but nothing enforced boundaries — any
file could import any other file, and a "feature folder" was convention, not
structure. The monorepo makes boundaries **physical**: to use package B, you
must declare B in your `package.json` and import by name.

### The three package kinds

**`apps/mobile` — the shell.**
Owns the route files (`app/*.tsx`), the root layout, app-level config, and the
app's own `package.json`. Does NOT own business logic, screens with real
content, or the navigation shell. If you're writing more than ~15 lines in
`apps/mobile/app/*.tsx`, the content belongs in a feature package.

**`packages/feature-*` — product domains.**
Each owns a slice of the product and its screens, internal components, and
internal state. Depends on `shared-*`. Never depends on another `feature-*`.

**`packages/shared-*` — cross-cutting concerns.**
The library layer. Each has a distinct job:

| Package | Owns |
|---|---|
| `shared-types` | Pure TS types. No runtime code, no deps. |
| `shared-config` | Static config — env, route path strings. |
| `shared-store` | Zustand slices (`uiStore`, `authStore`). |
| `shared-lib` | Utilities touching external services — API client, hooks. |
| `shared-ui` | Themed components + theme system. |

Shared packages never import `feature-*` or `apps/*`.

### Where new code goes — decision tree

| You're writing… | It goes in… |
|---|---|
| A route file (`app/foo.tsx`) | `apps/mobile/app/` |
| A screen with real content | a `feature-*` package |
| The nav shell (drawer, tabs) | `feature-navigation` |
| A reusable themed component | `shared-ui/src/components/` |
| A component used by one feature | that feature's `src/` |
| Cross-feature state | `shared-store` |
| Feature-local state (form inputs, modals) | `useState` inside the feature |
| A type used by 2+ packages | `shared-types` |
| A route path string | `shared-config/src/routes.ts` |
| An API call used by 2+ features | `shared-lib` |
| An API call used by one feature | that feature's `src/api.ts` |

Rule of thumb: **if only one component needs it, `useState`. If two unrelated
parts of the app need it, store. If two features need it, shared package.**

---

## 3. Where Dependencies Get Installed

### Two kinds, two places

| Kind | Where it goes | Why |
|---|---|---|
| **External** (react, axios, zustand) | Root `package.json` **or** `apps/mobile/package.json` | Single version repo-wide, one `node_modules` |
| **Internal** (`@squeez/*`) | **Each consuming package's `package.json`** | The boundary is the whole point |

### Which external goes where

Ask: **"Does any package under `packages/` import this?"**

- **No — only the app uses it** → `apps/mobile/package.json`
  - Examples: `expo`, `expo-router`, `expo-linking`, `expo-constants`,
    `react-native-gesture-handler`, `react-native-reanimated`,
    `react-native-safe-area-context`, `react-native-screens`

- **Yes — a shared or feature package uses it** → **root** `package.json`
  - Examples: `react`, `react-native` (used by `shared-ui`),
    `axios` (used by `shared-lib`), `zustand` (used by `shared-store`),
    `@react-navigation/bottom-tabs` (used by `feature-navigation`)

**Why the split:** `shared-ui` imports `react-native`. If `react-native` only
lived in `apps/mobile/package.json`, Metro couldn't resolve it from
`packages/shared-ui/`. Hoisting to root fixes that.

### Adding a new external

- **App-only** → `cd apps/mobile && npx expo install <pkg>`
- **Used by any package** → add to **root** `package.json`, then
  `npm install` from root

### Adding a new internal (`@squeez/*`)

1. Add `"@squeez/shared-x": "*"` to the consuming package's `dependencies`
2. `npm install` from root
3. `import { thing } from '@squeez/shared-x'`

### How it physically works

After `npm install`, `C:\RNM\node_modules\@squeez\` contains **junctions**
pointing at your `packages/*` folders. No copies, no build step, no `dist/`.
Edit any package's source, save, and the running app hot-reloads.

---

## 4. Prerequisites

| Tool | Version | Why |
|---|---|---|
| Node | 24.x | Matches `engines` in root `package.json` |
| npm | 11.x | Matches `packageManager` field |
| Java | 17 (JDK) | React Native 0.86 requires 17, not 21/25 |
| Android Studio | latest | For emulator + SDK |
| Android emulator | API 33+ | Run the app |

Verify Java:
```powershell
java -version   # must print 17.x
```

---

## 5. Commands — From the Repo Root

All commands run from `C:\RNM`.

| Command | What it does |
|---|---|
| `npm install` | Install everything + link workspaces |
| `npm run dev` | Start Metro for `apps/mobile` |
| `npm run typecheck` | Type-check every package |
| `npm run lint` | ESLint across the repo (once configured) |
| `npm run format` | Prettier — writes changes |
| `npm run format:check` | Prettier — reports only |
| `npm run gen` | Turborepo generator (see section 6) |

### First-time setup

```powershell
npm install
```

### Run on Android emulator

Start the emulator via Android Studio → Device Manager, then:

```powershell
npm run dev
```

Press `a` in the Metro terminal.

### Rebuild after adding a native package

```powershell
cd C:\RNM\apps\mobile
npx expo run:android
```

5–15 min the first time, ~30 s after. **Do not Ctrl+C during the Gradle
download.**

---

## 6. Generators — `npm run gen`

Turborepo + Plop provide two generators, defined in
`turbo/generators/config.ts`. Run from the repo root:

```powershell
npm run gen
```

You'll get an interactive prompt listing the two generators. Pick one, answer
the questions, and the files are scaffolded automatically.

### Generator 1 — `feature-package`

Creates `packages/feature-<slug>/` with:

```
packages/feature-<slug>/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    └── <Name>Screen.tsx
```

**Prompt:** feature slug (kebab-case, e.g. `splash`, `user-profile`).
Validated: lowercase letters, numbers, hyphens only; must start with a letter.

**After it runs, the CLI prints the next steps**, which are:

1. Add `"@squeez/feature-<slug>": "*"` to `apps/mobile/package.json`
2. Run `npm install` (links the new workspace package)
3. Create `apps/mobile/app/<slug>.tsx` — the route file
4. (Optional) Add an entry to
   `packages/feature-navigation/src/drawerItems.ts` if it should appear in the
   nav
5. Add any `@squeez/shared-*` deps to the new package's `package.json`, then
   `npm install` again

**The generator does NOT:**
- Register the package in the app
- Create the route file
- Add it to the nav list
- Run `npm install`

Those are deliberate — you might want to name the route differently from the
slug, or not add it to nav at all.

### Generator 2 — `shared-package`

Creates `packages/shared-<slug>/` with:

```
packages/shared-<slug>/
├── package.json
├── tsconfig.json
└── src/
    └── index.ts        # empty placeholder
```

**Prompts:**
1. Shared package slug (kebab-case)
2. Confirm this is needed by **2+ feature packages**

The second prompt is a **gate**. If you answer no, the generator **aborts
without creating anything** and prints:

> Aborted — a shared-* package is only for code used by 2+ features. If this is
> for one feature, put it inside that feature's own package instead.

This is intentional — the whole point is to prevent the shared layer from
accumulating single-consumer code. If your code is used by exactly one feature,
it belongs inside that feature's package.

**After it runs:**

1. Add real exports to `src/index.ts`
2. `npm install`
3. Add `"@squeez/shared-<slug>": "*"` to every consuming package's
   `package.json`, then `npm install` again

### Adding a new generator

The config lives in `turbo/generators/config.ts`. Templates live in
`turbo/generators/templates/<generator-name>/*.hbs`. Add a new
`plop.setGenerator(...)` block and matching template folder.

Custom helpers already defined:
- `properCase` — built into Plop (`user-profile` → `UserProfile`)
- `readableTitle` — defined locally (`user-profile` → `User Profile`)

---

## 7. Using Shared Packages

```tsx
import { Button, Card, Screen, ThemedText, useTheme } from '@squeez/shared-ui'
import { useAuthStore, useUiStore } from '@squeez/shared-store'
import { routes, env } from '@squeez/shared-config'
import { apiClient } from '@squeez/shared-lib'
import type { User } from '@squeez/shared-types'
```

See `packages/shared-ui/SHARED_UI.md` for the full component reference.

---

## 8. Theming

Four themes: `light`, `dark`, `blue`, `orange`.

- **State** lives in `shared-store`'s `uiStore` (`theme` field)
- **Tokens** live in `shared-ui/src/theme/`
- **Reading colors** — `const { theme } = useTheme()`, then use tokens like
  `theme.text.primary`, `theme.bg.surface`, `theme.brand.primary`
- **Switching** — `useUiStore((s) => s.setTheme)('dark')`, or the Settings
  screen

**Never hardcode a color in a component.** If a color appears twice, it belongs
in the theme.

### StyleSheet vs theme colors

- **Static** (padding, radius, flex) → `StyleSheet.create`
- **Theme-dependent** (colors) → inline objects referencing `theme`

```tsx
<View style={[styles.card, { backgroundColor: theme.bg.surface }]} />
```

### Adding a new token

Add it to **all four themes** in `themes.ts`. The `Theme` type refuses to
compile otherwise, which is the point.

---

## 9. Navigation

- **Drawer** and **Tabs** both read from
  `packages/feature-navigation/src/drawerItems.ts`
- Mode state lives in `uiStore.navigationMode` (`'drawer'` | `'tabs'`)
- Switch mode from Settings
- `apps/mobile/app/_layout.tsx` mounts `<NavigationRoot />`, which picks the
  navigator based on `uiStore`

### Why route files stay in the app

Expo Router discovers routes by scanning `apps/mobile/app/*.tsx` at build time.
It cannot find routes inside a package. So the files stay in the app, but
they're thin wrappers:

```tsx
// apps/mobile/app/dashboard.tsx
import { DashboardScreen } from '@squeez/feature-dashboard'
export default function Route() {
  return <DashboardScreen />
}
```

### Adding a screen to the nav

1. Create `apps/mobile/app/<name>.tsx`
2. Add one entry to `packages/feature-navigation/src/drawerItems.ts`:
   ```ts
   { name: '<name>', label: 'Label', icon: 'icon-outline' }
   ```
3. If the icon is new, add it to the `DrawerItem['icon']` union

The screen appears in both drawer and tabs automatically.

### Route paths — always from `shared-config`

```tsx
import { routes } from '@squeez/shared-config'
router.push(routes.settings)
```

`routes` values must exactly match filenames under `apps/mobile/app/`. If they
drift, navigation silently fails.

---

## 10. Zustand Stores

### Reading — prefer the selector form

```tsx
// Re-renders only when `theme` changes
const theme = useUiStore((s) => s.theme)

// Re-renders on any store change
const { theme, navigationMode } = useUiStore()
```

### Writing

```tsx
const setTheme = useUiStore((s) => s.setTheme)
setTheme('dark')
```

### Where NOT to put state

- Form inputs → `useState`
- Modal open/closed → `useState`
- Scroll positions → library handles it

---

## 11. Debugging

- **Metro terminal keys** aren't reliable on Windows. Use the emulator's
  `Ctrl+M` → **Open DevTools**.
- **Full debugger (sources, breakpoints):** Expo Go on Android has a bug that
  breaks the debugger. Use a **development build** (`npx expo run:android`) —
  the debugger works there.
- **Console logs** appear in the Metro terminal directly.

### When to restart Metro

- After changing `metro.config.js`, `babel.config.js`, or `app.json`
- After `npm install`
- After adding a native module (also needs `expo run:android`)
- If hot reload stops picking up changes

Restart with `npx expo start --clear` from `apps/mobile`.

---

## 12. Common Pitfalls

| Symptom | Fix |
|---|---|
| `Unable to resolve "../../App"` | `main` in `apps/mobile/package.json` must be `"expo-router/entry"` |
| Cannot find module `@squeez/x` | Run `npm install` from root |
| TS error on `__DEV__` in non-RN package | Declare `const __DEV__: boolean` locally |
| App stuck on old code | `npx expo start --clear` from `apps/mobile` |
| Native module missing at runtime | `npx expo run:android` from `apps/mobile` |
| Drawer/tabs colors don't update | Component isn't using `useTheme()` |
| `npm run gen` fails | Check `turbo/generators/config.ts` exists and templates folder is intact |
| New file doesn't show in `git status` | `git check-ignore -v path\to\file` |

---

## 13. Git

```powershell
git status
git add .
git commit -m "message"
```

Ignored: `node_modules`, `.expo`, `dist`, `android/`, `ios/`, `coverage`,
`*.tsbuildinfo`.

---

## 14. Quick Reference

| I want to… | Do this |
|---|---|
| Start the app | `npm run dev`, press `a` |
| Rebuild native code | `cd apps/mobile && npx expo run:android` |
| Scaffold a feature | `npm run gen` → feature-package |
| Scaffold a shared package | `npm run gen` → shared-package |
| Use a shared component | `import { Button } from '@squeez/shared-ui'` |
| Add a new screen to nav | Section 9 |
| Switch themes | Settings, or `useUiStore((s) => s.setTheme)('dark')` |
| Switch nav mode | Settings, or `useUiStore((s) => s.setNavigationMode)('tabs')` |
| Fix a package not resolving | `npm install` from root |
| Check my work | `npm run typecheck && npm run format:check` |

---

## 15. The Mental Model in One Paragraph

This repo is a **layered dependency graph**. The app shell at the top knows
about feature packages and orchestrates them. Feature packages own product
domains and depend on shared packages. Shared packages own cross-cutting
concerns and depend on nothing else. Data flows one way: from shared, through
features, to the app. Dependencies live in one of two places depending on who
uses them: the app's `package.json` for app-only externals, root for anything a
package imports. Internals (`@squeez/*`) always go per-package. Metro reads
every package's TypeScript source directly — no build step, no `dist/`, edits
are live. Everything themed reads from a single `useTheme()` hook backed by
`uiStore`. Everything navigable is driven by one nav list and a switcher.
`npm run gen` scaffolds new packages with the right shape already baked in.
When in doubt: **the shared code goes down a layer, the boundary goes in a
`package.json`, and the color comes from the theme.**
```

