# `SHARED_UI.md` — Component Usage Guide

Save this as `packages/shared-ui/SHARED_UI.md` (right next to `shared-ui/package.json`). It'll show up in your editor's file tree for anyone who opens that folder.

---

```md
# `@squeez/shared-ui` — Component Guide

Theme-aware React Native components. Every component reads from the current
theme via `useTheme()`, so changing the theme in Settings instantly recolors
everything that uses these components.

---

## Setup

Wrap your app once with `<ThemeProvider>` (already done in
`apps/mobile/app/_layout.tsx`):

```tsx
import { ThemeProvider } from '@squeez/shared-ui'

<ThemeProvider>
  <YourApp />
</ThemeProvider>
```

Any component below the provider can call `useTheme()`.

---

## Theme

### `useTheme()`

```tsx
import { useTheme } from '@squeez/shared-ui'

const { theme, themeName, setTheme } = useTheme()
```

- `theme` — the current theme's token object
- `themeName` — the active theme identifier (`'light' | 'dark' | 'blue' | 'orange'`)
- `setTheme(name)` — switch themes

### Theme tokens

| Token | Meaning |
|---|---|
| `theme.bg.primary` | Screen background |
| `theme.bg.surface` | Card / elevated surface background |
| `theme.bg.elevated` | Higher elevation surface |
| `theme.text.primary` | Primary text |
| `theme.text.secondary` | Secondary text |
| `theme.text.inverse` | Text on top of a filled brand color |
| `theme.brand.primary` | Brand accent (blue by default) |
| `theme.brand.primaryPressed` | Brand accent when pressed |
| `theme.brand.onPrimary` | Text/icon on top of `brand.primary` |
| `theme.border.default` | Default border color |
| `theme.status.danger` | Error/destructive red |
| `theme.status.success` | Success green |

**Rule of thumb:** never hardcode a color in a component. Always reach
for a token. That's what makes theme switching work.

---

## Components

### `<Screen>`

Full-screen container. Applies the themed background, horizontal padding,
and safe-area insets automatically.

```tsx
import { Screen } from '@squeez/shared-ui'

<Screen>              {/* fixed layout */}
  <ThemedText>Hello</ThemedText>
</Screen>

<Screen scrollable>   {/* scrolls if content overflows */}
  <ThemedText>Long content</ThemedText>
</Screen>
```

Props:

| Prop | Type | Default | Notes |
|---|---|---|---|
| `scrollable` | `boolean` | `false` | Wrap in a `ScrollView` |
| `padded` | `boolean` | `true` | Horizontal padding + safe area |
| `edges` | `('top'\|'bottom')[]` | `['top','bottom']` | Which safe-area insets to apply |

---

### `<ThemedText>`

Text with variant (size + weight) and tone (color). Use this instead of
raw `<Text>` everywhere.

```tsx
import { ThemedText } from '@squeez/shared-ui'

<ThemedText variant="h1">Dashboard</ThemedText>
<ThemedText variant="caption" tone="secondary">Last updated 2m ago</ThemedText>
<ThemedText tone="danger">Something went wrong</ThemedText>
```

Props:

| Prop | Type | Default | Options |
|---|---|---|---|
| `variant` | `string` | `'body'` | `h1`, `h2`, `h3`, `body`, `caption`, `label` |
| `tone` | `string` | `'primary'` | `primary`, `secondary`, `inverse`, `brand`, `danger` |

Accepts every standard `Text` prop (`numberOfLines`, `onPress`, `style`, etc.).

---

### `<Card>`

Themed surface container. Works as a plain box or with a title/header/footer.

```tsx
import { Card, ThemedText } from '@squeez/shared-ui'

// Simple
<Card>
  <ThemedText>Plain content</ThemedText>
</Card>

// With title + subtitle
<Card title="Recent Activity" subtitle="Last 24 hours">
  <ThemedText>...</ThemedText>
</Card>

// With a custom footer
<Card title="Booking">
  <ThemedText>...</ThemedText>
  <Card.Footer /> {/* placeholder — see props table */}
</Card>
```

Props:

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | — | Heading text |
| `subtitle` | `string` | — | Small text below title |
| `header` | `ReactNode` | — | Custom header — overrides `title`/`subtitle` |
| `footer` | `ReactNode` | — | Rendered below body, with a top border |
| `padded` | `boolean` | `true` | Inner padding on body/header/footer |

---

### `<Button>`

Multi-variant, multi-size, theme-aware button.

```tsx
import { Button } from '@squeez/shared-ui'

<Button label="Save" onPress={save} />
<Button label="Cancel" variant="secondary" onPress={cancel} />
<Button label="Delete" variant="danger" onPress={remove} />
<Button label="Learn more" variant="ghost" onPress={openDocs} />
<Button label="Sign up" variant="outline" onPress={signup} />

<Button label="Save" icon="save-outline" onPress={save} />
<Button label="Next" icon="arrow-forward" iconPosition="right" onPress={next} />

<Button label="Saving..." loading onPress={save} />
<Button label="Full width" fullWidth onPress={save} />
```

Props:

| Prop | Type | Default | Options |
|---|---|---|---|
| `label` | `string` | — | Button text (required) |
| `onPress` | `() => void` | — | Handler (required) |
| `variant` | `string` | `'primary'` | `primary`, `secondary`, `danger`, `ghost`, `outline` |
| `size` | `string` | `'md'` | `sm`, `md`, `lg` |
| `disabled` | `boolean` | `false` | |
| `loading` | `boolean` | `false` | Swaps label for a spinner |
| `icon` | `Ionicons name` | — | Any valid Ionicons name |
| `iconPosition` | `string` | `'left'` | `left`, `right` |
| `fullWidth` | `boolean` | `false` | |

---

### `<Table>`

Generic table with aligned columns, optional header, striped rows.

```tsx
import { Table, ThemedText, type Column } from '@squeez/shared-ui'

type Booking = { id: string; name: string; status: string; amount: number }

const columns: Column<Booking>[] = [
  { key: 'name', title: 'Name', flex: 2 },
  { key: 'status', title: 'Status' },
  {
    key: 'amount',
    title: 'Amount',
    align: 'right',
    render: (row) => <ThemedText>${row.amount.toLocaleString()}</ThemedText>,
  },
]

<Table
  data={bookings}
  columns={columns}
  keyExtractor={(row) => row.id}
  onRowPress={(row) => console.log(row.id)}
/>
```

Props:

| Prop | Type | Default | Notes |
|---|---|---|---|
| `data` | `T[]` | — | Rows |
| `columns` | `Column<T>[]` | — | Column config |
| `keyExtractor` | `(row) => string` | — | Unique key per row |
| `onRowPress` | `(row) => void` | — | Makes rows tappable |
| `showHeader` | `boolean` | `true` | |
| `striped` | `boolean` | `true` | Alternate row backgrounds |
| `emptyMessage` | `string` | `'No data'` | Shown when `data.length === 0` |

Column config:

| Field | Type | Default | Notes |
|---|---|---|---|
| `key` | `keyof T` | — | Must be a key on the row type |
| `title` | `string` | — | Header label |
| `width` | `number` | — | Fixed pixel width |
| `flex` | `number` | `1` | Flex weight (if `width` not set) |
| `align` | `'left'\|'center'\|'right'` | `'left'` | |
| `render` | `(row: T) => ReactNode` | — | Custom cell content |

**Don't set `width` and `flex` on the same column.** Pick one.

---

## Patterns

### Building a screen

```tsx
import { Screen, Card, Button, ThemedText } from '@squeez/shared-ui'

export default function ProfileScreen() {
  return (
    <Screen scrollable>
      <ThemedText variant="h1">Profile</ThemedText>

      <Card title="Account">
        <ThemedText>dev@squeez.local</ThemedText>
      </Card>

      <Button label="Sign out" variant="danger" onPress={signOut} />
    </Screen>
  )
}
```

### Adding a brand-colored heading

```tsx
<ThemedText variant="h2" tone="brand">Dashboard</ThemedText>
```

### Using theme tokens directly

For one-off styles not covered by a component:

```tsx
const { theme } = useTheme()

<View style={{ backgroundColor: theme.bg.surface, padding: 16 }}>
  <ThemedText>...</ThemedText>
</View>
```

### Switching themes from anywhere

```tsx
const { themeName, setTheme } = useTheme()

<Button label="Dark mode" onPress={() => setTheme('dark')} />
```

---

## Rules of thumb

1. **Use `<ThemedText>` instead of `<Text>`.** Raw text won't follow theme changes.
2. **Never hardcode colors.** Reach for `theme.*` tokens.
3. **Wrap screens in `<Screen>`.** Not raw `<View>`.
4. **Static styles go in `StyleSheet`, dynamic colors go inline.**
   `style={[styles.card, { backgroundColor: theme.bg.surface }]}`
5. **If a color appears twice in two different components, it belongs in the theme.**
```

---

Save it. Any new component we add later gets a section appended to this file. If you'd rather it live at the repo root (`SHARED_UI.md` instead of `packages/shared-ui/SHARED_UI.md`), say so and I'll adjust.