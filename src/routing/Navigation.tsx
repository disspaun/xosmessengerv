import { NavigationContainer } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'
import { Provider } from 'react-native-paper'

import { dataSource } from '@src/database/database'
import { useAppColorTheme } from '@src/hooks/useAppColorTheme'
import { useAppStateChangeWithCallbacks } from '@src/hooks/useAppStateChangeWithCallbacks'
import { useParsedStorage } from '@src/hooks/useAsyncStorage'
import { Credentials } from '@src/mytypes'
import { MainContentLayout } from '@src/routing/MainContentLayout'
import { navigationRef } from '@src/routing/navigationRef'
import { initialize } from '@src/ucore/actions'

export const Navigation = () => {
  const [credentials] = useParsedStorage<Credentials>('@credentials/object')
  const [isDatabaseReady, setIsDatabaseReady] = useState(false)

  const { theme, paperTheme, appThemeKey } = useAppColorTheme()

  const connect = useCallback(async () => {
    if (!dataSource.isInitialized) {
      await dataSource.initialize()
    }
    setIsDatabaseReady(true)
  }, [])

  useAppStateChangeWithCallbacks(undefined, connect)

  useEffect(() => {
    initialize()
    void connect()
  }, [])

  const displaySplashScreen = credentials === undefined || !isDatabaseReady || appThemeKey === undefined

  return (
    <Provider theme={paperTheme}>
      <NavigationContainer ref={navigationRef} theme={theme}>
        <MainContentLayout displaySplashScreen={displaySplashScreen} credentials={credentials} />
      </NavigationContainer>
    </Provider>
  )
}
