import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { useDefaultNavigationOptions } from '@src/hooks/useDefaultNavigationOptions'
import { useLocalization } from '@src/locales/localization'
import { ProfileStackParamList } from '@src/routing/NavigationTypes'
import { ProfileScreen } from '@src/screens/ProfileScreen'
import { useAppTheme } from '@src/theme/theme'

const Stack = createNativeStackNavigator<ProfileStackParamList>()

export function ProfileStack() {
  const { colors } = useAppTheme()
  const { t } = useLocalization()

  return (
    <Stack.Navigator screenOptions={{ ...useDefaultNavigationOptions(), headerShown: false }}>
      <Stack.Screen name="profile" component={ProfileScreen} />
    </Stack.Navigator>
  )
}
