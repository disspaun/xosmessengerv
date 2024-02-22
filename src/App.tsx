import moment from 'moment'
import 'moment/min/locales'
import { UIManager } from 'react-native'
import 'react-native-reanimated'
import { enableScreens } from 'react-native-screens'

import { ChatProvider } from '@src/providers/ChatProvider'
import { ProfileProvider } from '@src/providers/ProfileProvider'
import { SystemProvider } from '@src/providers/SystemProvider'
import { Navigation } from '@src/routing/Navigation'
import { isIOS } from '@src/utils/isIOS'

moment.locale('ru')

if (!isIOS) {
  enableScreens() // TODO check screens working properly // 29.09.2023
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }
}

export default function App() {
  return (
    <SystemProvider>
      <ProfileProvider>
        <ChatProvider>
          <Navigation />
        </ChatProvider>
      </ProfileProvider>
    </SystemProvider>
  )
}
