import { NativeStackNavigationOptions } from '@react-navigation/native-stack'

import { useAppTheme } from '@src/theme/theme'
import { isIOS } from '@src/utils/isIOS'

export function useDefaultNavigationOptions(): NativeStackNavigationOptions {
  const theme = useAppTheme()
  const statusBarStyle = theme.dark ? 'light' : 'dark'

  const systemLayoutsColor = theme.colors.mainBackground

  const forIOS = {
    headerTransparent: true,
    headerBlurEffect: theme.dark ? 'dark' : 'light',
  } as const

  return {
    ...(isIOS ? forIOS : undefined),
    headerTintColor: theme.colors.primaryTextColor,
    statusBarAnimation: 'slide',
    headerBackTitleVisible: false,
    headerBackTitle: '',
    statusBarStyle,
    statusBarTranslucent: true,
    statusBarColor: systemLayoutsColor,
    contentStyle: { backgroundColor: theme.colors.background, flex: 1 },
    // navigationBarHidden: true,
    navigationBarColor: systemLayoutsColor,
    headerShown: false,
  } as const
}
