import { DarkTheme, DefaultTheme, Theme as NavigationTheme, useTheme } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { darkColors, lightColors } from './colors'

const navigationLightColors: NavigationTheme['colors'] = {
  ...DefaultTheme.colors,
  background: '#fff',
  text: lightColors.primaryTextColor,
} as const

const navigationDarkColors: NavigationTheme['colors'] = {
  ...DarkTheme.colors,
  background: '#111111',
  text: darkColors.primaryTextColor,
}

export const AppLightTheme = {
  dark: false,
  colors: {
    ...lightColors,
    ...navigationLightColors,
  },
} as const

export const AppDarkTheme = {
  dark: true,
  colors: {
    ...darkColors,
    ...navigationDarkColors,
  },
} as const

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type CheckForValidColors = keyof typeof AppLightTheme.colors extends keyof typeof AppDarkTheme.colors
  ? keyof typeof AppDarkTheme.colors extends keyof typeof AppLightTheme.colors
    ? true
    : false
  : false

declare global {
  namespace App {
    type Theme = (typeof AppLightTheme | typeof AppDarkTheme) & {
      insets: ReturnType<typeof useSafeAreaInsets>
    }
  }
}

export const useAppTheme = () => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  return { ...theme, insets } as App.Theme
}
