import { StyleSheet, View, type ViewProps } from 'react-native'
import type { ReactNode } from 'react'
import { useTheme } from '../theme'
import { ThemedText } from './ThemedText'

type CardProps = ViewProps & {
  children?: ReactNode
  title?: string
  subtitle?: string
  header?: ReactNode
  footer?: ReactNode
  padded?: boolean
}

export function Card({
  children,
  title,
  subtitle,
  header,
  footer,
  padded = true,
  style,
  ...rest
}: CardProps) {
  const { theme } = useTheme()

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.bg.surface,
          borderColor: theme.border.default,
        },
        style,
      ]}
      {...rest}
    >
      {header ? (
        <View style={styles.headerSlot}>{header}</View>
      ) : title || subtitle ? (
        <View style={[styles.headerSlot, padded && styles.paddedContent]}>
          {title && <ThemedText variant="h3">{title}</ThemedText>}
          {subtitle && (
            <ThemedText variant="caption" tone="secondary" style={styles.subtitle}>
              {subtitle}
            </ThemedText>
          )}
        </View>
      ) : null}

      {children && (
        <View style={padded ? styles.paddedContent : undefined}>
          {children}
        </View>
      )}

      {footer && (
        <View
          style={[
            styles.footerSlot,
            { borderTopColor: theme.border.default },
            padded && styles.paddedContent,
          ]}
        >
          {footer}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8,
    overflow: 'hidden',
  },
  headerSlot: {
    paddingTop: 16,
  },
  subtitle: {
    marginTop: 2,
  },
  footerSlot: {
    borderTopWidth: 1,
    paddingVertical: 12,
  },
  paddedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
})