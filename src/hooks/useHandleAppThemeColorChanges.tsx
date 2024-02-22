import { setRootViewBackgroundColor } from '@pnthach95/react-native-root-view-background'
import { useEffect } from 'react'
import changeNavigationBarColor from 'react-native-navigation-bar-color'

import { useAppTheme } from '@src/theme/theme'
import { isIOS } from '@src/utils/isIOS'

export const changeAndroidNavBarColor = async (color: string, light: boolean) => {
  try {
    await changeNavigationBarColor(color, light, false)
  } catch (e) {
    console.log(e)
  }
}

export const useHandleAppThemeColorChanges = () => {
  const { colors, dark } = useAppTheme()

  useEffect(() => {
    setRootViewBackgroundColor(dark ? '#000' : '#fff')
    !isIOS && changeAndroidNavBarColor(colors.mainBackground, !dark).catch(() => {})
  }, [dark, colors.mainBackground])
}
