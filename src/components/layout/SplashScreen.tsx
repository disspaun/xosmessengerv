import { Icons } from '@assets'
import { useLayoutEffect } from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { changeAndroidNavBarColor } from '@src/hooks/useHandleAppThemeColorChanges'
import { Box } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'
import { isIOS } from '@src/utils/isIOS'

export const controlSystemLayoutsColors = (backgroundColor: string, isDark: boolean) => {
  StatusBar.setBackgroundColor(backgroundColor)
  StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content')
  changeAndroidNavBarColor(backgroundColor, !isDark).catch(() => {})
}

export const SplashScreen = () => {
  const { colors, dark } = useAppTheme()

  useLayoutEffect(() => {
    if (!isIOS) {
      controlSystemLayoutsColors(colors.mainBackground, dark)
    }
  }, [])

  return (
    <SafeAreaProvider>
      <Box flex justifyContent="center" alignItems="center" backgroundColor={colors.mainBackground}>
        <Icons.svg.ulogo width={188} height={124} fill={colors.iconColor} />
      </Box>
    </SafeAreaProvider>
  )
}
