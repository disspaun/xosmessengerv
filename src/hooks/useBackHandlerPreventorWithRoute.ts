import { useFocusEffect, useRoute } from '@react-navigation/native'
import { useCallback } from 'react'
import { BackHandler } from 'react-native'

import { AvailableRoutes } from '@src/routing/NavigationTypes'
import { isIOS } from '@src/utils/isIOS'

export const useBackHandlerPreventorWithRoute = (routeName: AvailableRoutes) => {
  const route = useRoute()

  useFocusEffect(
    useCallback(() => {
      if (isIOS) {
        return
      }
      const onBackPress = () => {
        if (route.name === routeName) {
          BackHandler.exitApp()
          return true
        } else {
          return false
        }
      }

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return subscription.remove
    }, [routeName, route]),
  )
}
