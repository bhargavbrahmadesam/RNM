import { palette } from './palettes'

export type Theme = {
  bg: {
    primary: string
    surface: string
    elevated: string
  }
  text: {
    primary: string
    secondary: string
    inverse: string
  }
  brand: {
    primary: string
    primaryPressed: string
    onPrimary: string
  }
  border: {
    default: string
  }
  status: {
    danger: string
    success: string
  }
}

export const lightTheme: Theme = {
  bg: {
    primary: palette.gray[50],
    surface: palette.gray[0],
    elevated: palette.gray[0],
  },
  text: {
    primary: palette.gray[900],
    secondary: palette.gray[700],
    inverse: palette.gray[0],
  },
  brand: {
    primary: palette.blue[500],
    primaryPressed: palette.blue[700],
    onPrimary: palette.gray[0],
  },
  border: {
    default: palette.gray[100],
  },
  status: {
    danger: palette.red[500],
    success: palette.green[500],
  },
}

export const darkTheme: Theme = {
  bg: {
    primary: palette.gray[900],
    surface: palette.gray[800],
    elevated: palette.gray[800],
  },
  text: {
    primary: palette.gray[0],
    secondary: palette.gray[300],
    inverse: palette.gray[900],
  },
  brand: {
    primary: palette.blue[500],
    primaryPressed: palette.blue[700],
    onPrimary: palette.gray[0],
  },
  border: {
    default: palette.gray[700],
  },
  status: {
    danger: palette.red[500],
    success: palette.green[500],
  },
}

export const blueTheme: Theme = {
  bg: {
    primary: palette.blue[50],
    surface: palette.gray[0],
    elevated: palette.gray[0],
  },
  text: {
    primary: palette.blue[900],
    secondary: palette.blue[700],
    inverse: palette.gray[0],
  },
  brand: {
    primary: palette.blue[500],
    primaryPressed: palette.blue[700],
    onPrimary: palette.gray[0],
  },
  border: {
    default: palette.blue[100],
  },
  status: {
    danger: palette.red[500],
    success: palette.green[500],
  },
}

export const orangeTheme: Theme = {
  bg: {
    primary: palette.orange[50],
    surface: palette.gray[0],
    elevated: palette.gray[0],
  },
  text: {
    primary: palette.orange[900],
    secondary: palette.orange[700],
    inverse: palette.gray[0],
  },
  brand: {
    primary: palette.orange[500],
    primaryPressed: palette.orange[700],
    onPrimary: palette.gray[0],
  },
  border: {
    default: palette.orange[100],
  },
  status: {
    danger: palette.red[500],
    success: palette.green[500],
  },
}

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  blue: blueTheme,
  orange: orangeTheme,
} as const

export type ThemeName = keyof typeof themes