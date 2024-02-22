import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { useDefaultNavigationOptions } from '@src/hooks/useDefaultNavigationOptions'
import { useLocalization } from '@src/locales/localization'
import { HomeStackParamList } from '@src/routing/NavigationTypes'
import { ChatsScreen } from '@src/screens/ChatsScreen'
import { useAppTheme } from '@src/theme/theme'

const Stack = createNativeStackNavigator<HomeStackParamList>()

export function HomeStack() {
  const { colors } = useAppTheme()
  const { t } = useLocalization()

  return (
    <Stack.Navigator screenOptions={{ ...useDefaultNavigationOptions(), headerShown: false }}>
      <Stack.Screen name="chats" component={ChatsScreen} />
    </Stack.Navigator>
  )
}
