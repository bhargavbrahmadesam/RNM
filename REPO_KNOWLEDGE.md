# Updated `DEVELOPER_GUIDE.md`

Replace `C:\RNM\DEVELOPER_GUIDE.md` with this. Sections that changed are marked with `← UPDATED` inline in the diff so you can see what moved:

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
├── feature-notifications/  # Local notifications: store, screen, wrapper
├── feature-toolkit/        # In-app "storybook" for shared UI previews
├── shared-types/           # Pure TS types, no runtime, no deps
├── shared-config/          # Env, route path constants
├── shared-store/           # Zustand slices (authStore, uiStore)
├── shared-lib/             # API client, hooks, notifications wrapper
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

**Exception — `feature-toolkit`:** this package is a preview/demo shell. It is
allowed to depend on other feature packages (to render their showcases). No
other feature package may do this.

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

Current feature packages:

| Package | Owns |
|---|---|
| `feature-dashboard` | Dashboard screen |
| `feature-navigation` | Drawer, tabs, mode switcher, `drawerItems` list |
| `feature-notifications` | Notification store, Notifications screen |
| `feature-toolkit` | In-app component previews (like a mini storybook) |

**`packages/shared-*` — cross-cutting concerns.**
The library layer. Each has a distinct job:

| Package | Owns |
|---|---|
| `shared-types` | Pure TS types. No runtime code, no deps. |
| `shared-config` | Static config — env, route path strings. |
| `shared-store` | Zustand slices (`uiStore`, `authStore`). |
| `shared-lib` | Utilities touching external services — API client, hooks, **notifications wrapper**. |
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
| A preview/demo of a shared component | `feature-toolkit/src/showcases/` |
| Cross-feature state | `shared-store` |
| Feature-local state (form inputs, modals) | `useState` inside the feature |
| A type used by 2+ packages | `shared-types` |
| A route path string | `shared-config/src/routes.ts` |
| An API call used by 2+ features | `shared-lib` |
| An API call used by one feature | that feature's `src/api.ts` |
| A notifications utility (permission, schedule, tap listener) | `shared-lib/src/notifications.ts` |

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
    `@react-navigation/bottom-tabs` (used by `feature-navigation`),
    `expo-notifications` (used by `shared-lib`)

### Adding a new external

- **App-only** → `cd apps/mobile && npx expo install <pkg>`
- **Used by any package** → add to **root** `package.json`, then
  `npm install` from root

### Adding a new internal (`@squeez/*`)

1. Add `"@squeez/shared-x": "*"` to the consuming package's `dependencies`
2. `npm install` from root
3. `import { thing } from '@squeez/shared-x'`

### `.npmrc` — legacy peer deps

Root `.npmrc` contains:

```
legacy-peer-deps=true
```

This is required because Expo SDK 57 has a known peer-dependency conflict
between `react-dom@19.3.0` and the pinned `react@19.2.3`. Without this, every
`npm install` fails. Do not remove it unless the upstream conflict is fixed.

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

If `apps/mobile/android/` has been deleted, `npx expo run:android` regenerates
it automatically via `expo prebuild`. No extra step needed.

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

**After it runs**, the CLI prints the next steps:

1. Add `"@squeez/feature-<slug>": "*"` to `apps/mobile/package.json`
2. Run `npm install`
3. Create `apps/mobile/app/<slug>.tsx` — the route file
4. (Optional) Add an entry to
   `packages/feature-navigation/src/drawerItems.ts`
5. Add any `@squeez/shared-*` deps to the new package, then `npm install`

**The generator does NOT:** register in the app, create the route file, add to
nav, or run `npm install`. Those are deliberate — you may want a different
route name, or no nav entry.

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

**After it runs:** add real exports to `src/index.ts`, `npm install`, then add
the dep to every consuming package and `npm install` again.

### Adding a new generator

Config: `turbo/generators/config.ts`. Templates:
`turbo/generators/templates/<generator-name>/*.hbs`. Add a
`plop.setGenerator(...)` block and matching template folder.

Helpers available:
- `properCase` — built into Plop (`user-profile` → `UserProfile`)
- `readableTitle` — defined locally (`user-profile` → `User Profile`)

---

## 7. Using Shared Packages

```tsx
import { Button, Card, Screen, ThemedText, useTheme } from '@squeez/shared-ui'
import { useAuthStore, useUiStore } from '@squeez/shared-store'
import { routes, env } from '@squeez/shared-config'
import {
  apiClient,
  requestNotificationPermission,
  scheduleLocalNotification,
  addNotificationTapListener,
} from '@squeez/shared-lib'
import type { User } from '@squeez/shared-types'
import { useNotificationStore } from '@squeez/feature-notifications'
```

See `packages/shared-ui/SHARED_UI.md` for the full component reference.

---

## 8. Theming

Four themes: `light`, `dark`, `blue`, `orange`.

- **State** lives in `shared-store`'s `uiStore` (`theme` field)
- **Tokens** live in `shared-ui/src/theme/`
- **Reading colors** — `const { theme } = useTheme()`, then use tokens like
  `theme.text.primary`, `theme.bg.surface`, `theme.brand.primary`
- **Switching** — `useUiStore((s) => s.setTheme)('dark')`, or Settings screen

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

## 11. Local Notifications

Local notifications are notifications the device schedules and shows itself.
No server, no push service, no Apple/Google credentials.

### Where the code lives

- **Wrapper** — `shared-lib/src/notifications.ts`
  - `requestNotificationPermission()`
  - `setupAndroidChannel()`
  - `scheduleLocalNotification({ title, body, url, seconds })`
  - `cancelNotification(id)`
  - `addNotificationTapListener(handler)`
- **Store** — `feature-notifications/src/notificationStore.ts`
  - `useNotificationStore` with `items`, `add`, `markRead`, `markAllRead`,
    `clear`
- **Screen** — `feature-notifications/src/NotificationsScreen.tsx`
  - Route file at `apps/mobile/app/notifications.tsx`
- **Preview / test buttons** — `feature-toolkit/src/showcases/NotificationsShowcase.tsx`

### Requirements

- **Native rebuild** — `expo-notifications` has native code. After installing
  it, run `npx expo run:android`. JS reload is not enough.
- **Plugin registered** — `"expo-notifications"` is in `app.json` `plugins`.
- **Permission** — the first time you schedule, the OS asks. Android 13+
  requires the `POST_NOTIFICATIONS` runtime permission.
- **Android channel** — required on Android 8+. `setupAndroidChannel()` creates
  one named "default" with `HIGH` importance. Call it before scheduling.
- **Foreground handler** — `setNotificationHandler` at the top of
  `notifications.ts` enables notifications while the app is open. Without it,
  they're silently dropped.

### `sound` — the gotcha

Two different types, two different values:

- **Channel** (`NotificationChannelInput.sound`) → `string | null`. Use
  `'default'`.
- **Content** (`NotificationContentInput.sound`) → `boolean | 'default' | string | null`.
  Use `true`.

Passing `'default'` to content triggers:
> Custom sound 'default' not found in native app.

Use `true` for content. Keep `'default'` for the channel.

### Scheduling a notification

```tsx
import { scheduleLocalNotification } from '@squeez/shared-lib'

await scheduleLocalNotification({
  title: 'Booking confirmed',
  body: `Booking #${id} has been created`,
  seconds: 5,           // fire in 5 seconds; omit for default
  url: '/bookings/123', // route to open on tap
})
```

### Tap → navigate (not yet wired)

`addNotificationTapListener` exists in `shared-lib` but is not yet mounted in
`apps/mobile/app/_layout.tsx`. Until that's done, tapping a notification opens
the app but does not navigate. When wiring it, read `payload.url` and call
`router.push(payload.url)`.

### Testing

Open the **Toolkit** screen in the app → scroll to the **Notifications** card.
Buttons:
- **In 5s** — schedule a notification 5 seconds out
- **In 1s** — same, faster
- **→ Dashboard / → Settings / → Notifications** — schedule with a `url` payload
- **Cancel last** — cancels the most recently scheduled
- **Clear list** — clears the in-app list

---

## 12. Debugging

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

## 13. Common Pitfalls

| Symptom | Fix |
|---|---|
| `Unable to resolve "../../App"` | `main` in `apps/mobile/package.json` must be `"expo-router/entry"` |
| Cannot find module `@squeez/x` | Run `npm install` from root |
| TS error on `__DEV__` in non-RN package | Declare `const __DEV__: boolean` locally |
| App stuck on old code | `npx expo start --clear` from `apps/mobile` |
| Native module missing at runtime | `npx expo run:android` from `apps/mobile` |
| `npm install` fails with ERESOLVE | Ensure `.npmrc` has `legacy-peer-deps=true` |
| Drawer/tabs colors don't update | Component isn't using `useTheme()` |
| Notifications don't appear | Check: permission granted, Android channel created, `setNotificationHandler` loaded |
| `Custom sound 'default' not found` | Use `sound: true` in notification content, not `'default'` |
| `npm run gen` fails | Check `turbo/generators/config.ts` exists and templates folder is intact |
| New file doesn't show in `git status` | `git check-ignore -v path\to\file` |

---

## 14. Git

```powershell
git status
git add .
git commit -m "message"
```

Ignored: `node_modules`, `.expo`, `dist`, `android/`, `ios/`, `coverage`,
`*.tsbuildinfo`.

---

## 15. Quick Reference

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
| Test a notification | Toolkit → Notifications card → "In 5s" |
| Preview a shared component | Toolkit screen (see `feature-toolkit`) |
| Fix a package not resolving | `npm install` from root |
| Check my work | `npm run typecheck && npm run format:check` |

---

## 16. The Mental Model in One Paragraph

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
`feature-toolkit` is the in-app storybook for previewing shared UI. When in
doubt: **the shared code goes down a layer, the boundary goes in a
`package.json`, and the color comes from the theme.**
```

---

# Updated `packages/shared-ui/SHARED_UI.md`

**No changes needed.** Nothing about `shared-ui` changed in this round of work. The existing file is accurate.

---

# What Changed in the Guide (summary)

1. **Section 1** — added `feature-notifications` and `feature-toolkit` to the tree. Added an explicit note about the `feature-toolkit` exception to the "no feature imports another feature" rule.
2. **Section 2** — added a table of current feature packages. Added `feature-toolkit` and notifications entries to the decision tree.
3. **Section 3** — added `expo-notifications` to the list of externals that live at root. Added a section documenting `.npmrc` and why `legacy-peer-deps=true` is required.
4. **Section 5** — noted that `expo run:android` regenerates `android/` automatically if deleted.
5. **Section 7** — added notification imports to the "using shared packages" examples.
6. **Section 11** — **entirely new section** on local notifications: where the code lives, the requirements, the `sound` gotcha, how to schedule, how to test.
7. **Section 13** — added pitfalls for ERESOLVE, notifications not appearing, and the custom sound error.
8. **Section 15** — added "Test a notification" and "Preview a shared component" to quick reference.
9. **Section 16** — added mention of `feature-toolkit` to the mental model.

---

Save both files. The next logical piece is **Step 6** — wiring the tap listener in `_layout.tsx` so tapping a notification actually navigates. Say "next" when ready.