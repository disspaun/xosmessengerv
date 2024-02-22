import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { useDefaultNavigationOptions } from '@src/hooks/useDefaultNavigationOptions'
import { useLocalization } from '@src/locales/localization'
import { UnauthorizedStackParamList } from '@src/routing/NavigationTypes'
import { defaultAnimationByPlatform } from '@src/routing/stacks/RootStack'
import { DeleteAccountScreen } from '@src/screens/DeleteAccountScreen'
import { ImportAccountConfirmScreen } from '@src/screens/ImportAccountConfirmScreen'
import { ImportAccountFormScreen } from '@src/screens/ImportAccountFormScreen'
import { ImportAccountScreen } from '@src/screens/ImportAccountScreen'
import { IntroScreen } from '@src/screens/IntroScreen'
import { ProcessingScreen } from '@src/screens/ProcessingScreen'
import { SignInScreen } from '@src/screens/SignInScreen'
import { SignUpScreen } from '@src/screens/SignUpScreen'
import { getAvailableProfiles } from '@src/ucore/actions'

const Stack = createNativeStackNavigator<UnauthorizedStackParamList>()

export const UnauthorizedStack = () => {
  const { t } = useLocalization()

  const availableProfiles = getAvailableProfiles()

  return (
    <Stack.Navigator screenOptions={{ ...useDefaultNavigationOptions(), animation: 'none' }}>
      {!availableProfiles?.length ? (
        <Stack.Screen name="intro" component={IntroScreen} options={{ animation: defaultAnimationByPlatform }} />
      ) : null}
      <Stack.Screen name="signIn" component={SignInScreen} options={{ animation: defaultAnimationByPlatform }} />

      <Stack.Screen name="signUp" component={SignUpScreen} options={{ animation: defaultAnimationByPlatform }} />
      <Stack.Screen name="startup" component={ProcessingScreen} options={{ animation: defaultAnimationByPlatform }} />
      <Stack.Screen
        name="deleteAccount"
        component={DeleteAccountScreen}
        options={{ animation: defaultAnimationByPlatform }}
      />
      <Stack.Screen
        name="importAccount"
        component={ImportAccountScreen}
        options={{ animation: defaultAnimationByPlatform }}
      />
      <Stack.Screen
        name="importAccountForm"
        component={ImportAccountFormScreen}
        options={{ animation: defaultAnimationByPlatform }}
      />
      <Stack.Screen
        name="importAccountConfirm"
        component={ImportAccountConfirmScreen}
        options={{ animation: defaultAnimationByPlatform }}
      />
    </Stack.Navigator>
  )
}
