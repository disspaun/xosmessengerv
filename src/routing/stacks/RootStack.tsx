import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useEffect } from 'react'

import { useDefaultNavigationOptions } from '@src/hooks/useDefaultNavigationOptions'
import { useLocalization } from '@src/locales/localization'
import { AsyncStorageParsedValue, Credentials } from '@src/mytypes'
import { RootStackParamList } from '@src/routing/NavigationTypes'
import { Tabs } from '@src/routing/Tabs'
import { AddContactScreen } from '@src/screens/AddContactScreen'
import { ChatScreen } from '@src/screens/ChatScreen'
import { ContactsScreen } from '@src/screens/ContactsScreen'
import { MediaSettingsScreen } from '@src/screens/MediaSettingsScreen'
import { ProcessingScreen } from '@src/screens/ProcessingScreen'
import { ScanCodeScreen } from '@src/screens/ScanCodeScreen'
import { SecuritySettingsScreen } from '@src/screens/SecuritySettingsScreen'
import { ShareScreen } from '@src/screens/ShareScreen'
import { SingleFieldScreen } from '@src/screens/SingleFieldScreen'
import { restoreProfile } from '@src/ucore/hydrations'
import { isIOS } from '@src/utils/isIOS'

const Stack = createNativeStackNavigator<RootStackParamList>()

export const defaultAnimationByPlatform = isIOS ? 'slide_from_right' : 'fade'

export const RootStack = ({ credentials }: { credentials: AsyncStorageParsedValue<Credentials> }) => {
  const { t } = useLocalization()

  useEffect(() => {
    if (credentials) {
      void restoreProfile(credentials)
    }
  }, [])

  return (
    <Stack.Navigator screenOptions={{ ...useDefaultNavigationOptions() }}>
      <Stack.Screen name="tabs" component={Tabs} options={{ animation: 'fade', statusBarStyle: undefined }} />
      <Stack.Screen name="chat" component={ChatScreen} options={{ animation: defaultAnimationByPlatform }} />
      <Stack.Screen name="contacts" component={ContactsScreen} options={{ animation: defaultAnimationByPlatform }} />
      <Stack.Screen
        name="addContact"
        component={AddContactScreen}
        options={{ animation: defaultAnimationByPlatform }}
      />
      <Stack.Screen
        name="mediaSettings"
        component={MediaSettingsScreen}
        options={{ animation: defaultAnimationByPlatform }}
      />
      <Stack.Screen
        name="security"
        component={SecuritySettingsScreen}
        options={{ animation: defaultAnimationByPlatform }}
      />
      <Stack.Screen
        name="singleField"
        component={SingleFieldScreen}
        options={{ animation: defaultAnimationByPlatform }}
      />
      <Stack.Screen
        name="processing"
        component={ProcessingScreen}
        options={{ animation: defaultAnimationByPlatform }}
      />
      <Stack.Screen name="scanCode" component={ScanCodeScreen} options={{ animation: defaultAnimationByPlatform }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="share" component={ShareScreen} />
      </Stack.Group>
    </Stack.Navigator>
  )
}
