import { useMemo } from 'react'
import { useColorScheme } from 'react-native'
import { DefaultTheme } from 'react-native-paper'

import { useCustomAsyncStorage } from '@src/hooks/useAsyncStorage'
import { AppDarkTheme, AppLightTheme } from '@src/theme/theme'

export const useAppColorTheme = () => {
  const [appThemeKey] = useCustomAsyncStorage('@appTheme/string')
  const deviceColorScheme = useColorScheme()

  let theme = AppLightTheme

  switch (appThemeKey) {
    case 'dark': {
      theme = AppDarkTheme
      break
    }
    case 'light': {
      theme = AppLightTheme
      break
    }
    default: {
      theme = deviceColorScheme === 'dark' ? AppDarkTheme : AppLightTheme
      break
    }
  }

  const paperTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        ...theme.colors,
      },
    }),
    [theme.colors],
  )

  return { theme, paperTheme, appThemeKey }
}
