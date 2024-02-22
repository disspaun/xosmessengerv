import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import { SaveToCameraRollOptions } from '@react-native-camera-roll/camera-roll/src/CameraRoll'
import { useCallback } from 'react'
import { PermissionsAndroid, Platform } from 'react-native'

import { LocalizationKeys, useLocalization } from '@src/locales/localization'
import { useSnackBarContext } from '@src/providers/SnackBarProvider'
import { openUrl } from '@src/utils/actions'
import { isIOS } from '@src/utils/isIOS'

export async function hasAndroidPermission() {
  const getCheckPermissionPromise = () => {
    if (Platform.Version >= 33) {
      return Promise.all([
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES),
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO),
      ]).then(
        ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
          hasReadMediaImagesPermission && hasReadMediaVideoPermission,
      )
    } else {
      return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
    }
  }

  const hasPermission = await getCheckPermissionPromise()
  if (hasPermission) {
    return true
  }
  const getRequestPermissionPromise = () => {
    if (Platform.Version >= 33) {
      return PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]).then(
        (statuses) =>
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] === PermissionsAndroid.RESULTS.GRANTED &&
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] === PermissionsAndroid.RESULTS.GRANTED,
      )
    } else {
      return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE).then(
        (status) => status === PermissionsAndroid.RESULTS.GRANTED,
      )
    }
  }

  return await getRequestPermissionPromise()
}

interface IUseSavePicture {
  successMessage?: LocalizationKeys
}

export const useSavePicture = ({ type, album, successMessage }: SaveToCameraRollOptions & IUseSavePicture) => {
  const { setupSnackBar, setSnackBarVisible } = useSnackBarContext()
  const { t } = useLocalization()

  const savePicture = useCallback(
    async (localUri: string) => {
      if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
        return
      }

      try {
        const result = await CameraRoll.save(localUri, { type })
        setupSnackBar({
          text: successMessage ? t(successMessage) : t('saved'),
          action: {
            onPress: () => {
              openUrl(isIOS ? 'photos-redirect://' : result)
            },
            label: t('open'),
          },
        })
        setSnackBarVisible(true)
      } catch (e) {
        setupSnackBar({
          text: t('error'),
        })
        setSnackBarVisible(true)
      }
    },
    [successMessage],
  )

  return { savePicture }
}
