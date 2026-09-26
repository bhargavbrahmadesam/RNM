import { StyleSheet, Text, type TextProps } from 'react-native'
import { useTheme } from '../theme'

type Variant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label'
type Tone = 'primary' | 'secondary' | 'inverse' | 'brand' | 'danger'

type ThemedTextProps = TextProps & {
  variant?: Variant
  tone?: Tone
}

export function ThemedText({
  variant = 'body',
  tone = 'primary',
  style,
  ...rest
}: ThemedTextProps) {
  const { theme } = useTheme()

  const toneColor: Record<Tone, string> = {
    primary: theme.text.primary,
    secondary: theme.text.secondary,
    inverse: theme.text.inverse,
    brand: theme.brand.primary,
    danger: theme.status.danger,
  }

  return (
    <Text
      style={[styles[variant], { color: toneColor[tone] }, style]}
      {...rest}
    />
  )
}

const styles = StyleSheet.create({
  h1: { fontSize: 28, fontWeight: '700', lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: '700', lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 22 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  label: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
})