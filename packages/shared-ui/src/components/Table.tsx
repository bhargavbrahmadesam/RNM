import { Fragment } from 'react'
import type { ReactNode } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useTheme } from '../theme'
import { ThemedText } from './ThemedText'

export type Column<T> = {
  key: keyof T & string
  title: string
  width?: number
  flex?: number
  align?: 'left' | 'center' | 'right'
  render?: (row: T) => ReactNode
}

type TableProps<T> = {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (row: T) => string
  onRowPress?: (row: T) => void
  showHeader?: boolean
  striped?: boolean
  emptyMessage?: string
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  onRowPress,
  showHeader = true,
  striped = true,
  emptyMessage = 'No data',
}: TableProps<T>) {
  const { theme } = useTheme()

  const cellStyle = (col: Column<T>) => [
    styles.cell,
    col.width !== undefined
      ? { width: col.width }
      : { flex: col.flex ?? 1 },
    { alignItems: alignToFlex(col.align) },
  ]

  if (data.length === 0) {
    return (
      <View
        style={[
          styles.empty,
          { backgroundColor: theme.bg.surface, borderColor: theme.border.default },
        ]}
      >
        <ThemedText tone="secondary">{emptyMessage}</ThemedText>
      </View>
    )
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.bg.surface, borderColor: theme.border.default },
      ]}
    >
      {showHeader && (
        <View
          style={[
            styles.row,
            styles.headerRow,
            { borderBottomColor: theme.border.default },
          ]}
        >
          {columns.map((col) => (
            <View key={col.key} style={cellStyle(col)}>
              <ThemedText variant="label" tone="secondary">
                {col.title}
              </ThemedText>
            </View>
          ))}
        </View>
      )}

      {data.map((row, rowIndex) => {
        const isLast = rowIndex === data.length - 1
        const rowBackground =
          striped && rowIndex % 2 === 1 ? theme.bg.primary : 'transparent'

        const content = (
          <View
            style={[
              styles.row,
              !isLast && { borderBottomColor: theme.border.default, borderBottomWidth: 1 },
              { backgroundColor: rowBackground },
            ]}
          >
            {columns.map((col) => (
              <View key={col.key} style={cellStyle(col)}>
                {col.render ? (
                  col.render(row)
                ) : (
                  <ThemedText>{String(row[col.key] ?? '')}</ThemedText>
                )}
              </View>
            ))}
          </View>
        )

        if (onRowPress) {
          return (
            <Pressable
              key={keyExtractor(row)}
              onPress={() => onRowPress(row)}
              style={({ pressed }) => [pressed && styles.pressed]}
            >
              {content}
            </Pressable>
          )
        }

        return <Fragment key={keyExtractor(row)}>{content}</Fragment>
      })}
    </View>
  )
}

function alignToFlex(
  align: Column<unknown>['align'],
): 'flex-start' | 'center' | 'flex-end' {
  if (align === 'center') return 'center'
  if (align === 'right') return 'flex-end'
  return 'flex-start'
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  empty: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRow: {
    borderBottomWidth: 1,
  },
  cell: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  pressed: {
    opacity: 0.6,
  },
})