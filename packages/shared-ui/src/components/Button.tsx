import { ActivityIndicator, Pressable, StyleSheet, type ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../theme'
import { ThemedText } from './ThemedText'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

type ButtonProps = {
  label: string
  onPress: () => void
  variant?: Variant
  size?: Size
  disabled?: boolean
  loading?: boolean
  icon?: keyof typeof Ionicons.glyphMap
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

type VariantColors = {
  background: string
  border: string
  text: string
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
}: ButtonProps) {
  const { theme } = useTheme()
  const isDisabled = disabled || loading

  const variantColors: Record<Variant, VariantColors> = {
    primary: {
      background: theme.brand.primary,
      border: 'transparent',
      text: theme.brand.onPrimary,
    },
    secondary: {
      background: theme.bg.surface,
      border: theme.border.default,
      text: theme.text.primary,
    },
    danger: {
      background: theme.status.danger,
      border: 'transparent',
      text: theme.text.inverse,
    },
    ghost: {
      background: 'transparent',
      border: 'transparent',
      text: theme.brand.primary,
    },
    outline: {
      background: 'transparent',
      border: theme.brand.primary,
      text: theme.brand.primary,
    },
  }

  const colors = variantColors[variant]
  const sizeStyles = sizeMap[size]
  const iconSize = sizeStyles.iconSize

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={iconSize} color={colors.text} />
          )}
          <ThemedText
            variant={sizeStyles.textVariant}
            style={[styles.label, { color: colors.text }]}
          >
            {label}
          </ThemedText>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={iconSize} color={colors.text} />
          )}
        </>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    gap: 8,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
})

const sizeMap: Record<
  Size,
  {
    container: ViewStyle
    textVariant: 'caption' | 'body' | 'label'
    iconSize: number
  }
> = {
  sm: {
    container: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
    textVariant: 'caption',
    iconSize: 14,
  },
  md: {
    container: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    textVariant: 'label',
    iconSize: 18,
  },
  lg: {
    container: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10 },
    textVariant: 'body',
    iconSize: 20,
  },
}