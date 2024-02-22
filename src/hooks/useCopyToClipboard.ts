import Clipboard from '@react-native-clipboard/clipboard'
import { useCallback } from 'react'

import { LocalizationKeys, useLocalization } from '@src/locales/localization'
import { useSnackBarContext } from '@src/providers/SnackBarProvider'

export const useCopyToClipboard = () => {
  const { setupSnackBar, setSnackBarVisible } = useSnackBarContext()

  const { t } = useLocalization()

  const copyToClipboard = useCallback(
    (text: string, snackBarMessageText?: LocalizationKeys) => {
      Clipboard.setString(text)
      // if (!isIOS) {
      //   return
      // }
      setupSnackBar({
        text: snackBarMessageText ? t(snackBarMessageText) : t('textCopied'),
      })
      setSnackBarVisible(true)
    },
    [setSnackBarVisible],
  )

  return { copyToClipboard }
}
