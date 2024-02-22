import { useCallback, useState } from 'react'

import { useLocalization } from '@src/locales/localization'
import { useSnackBarContext } from '@src/providers/SnackBarProvider'

export const useAutoAuthorizationSwitch = () => {
  const [isAutoAuthorization, setIsAutoauthorization] = useState(true)
  const { t } = useLocalization()

  const { setupSnackBar, setSnackBarVisible } = useSnackBarContext()

  const onAutoAuthorizationSwitch = useCallback((value: boolean) => {
    setIsAutoauthorization(value)
    setupSnackBar({
      // action: {
      //   onPress: () => {
      //     setIsAutoauthorization((prev) => !prev)
      //   },
      //   label: t('undo'),
      // },
      text: t('authorizationOption'),
    })
    value && setSnackBarVisible(true)
  }, [])

  return { onAutoAuthorizationSwitch, isAutoAuthorization }
}
