import { Platform } from 'react-native'

import { isIOS } from '@src/utils/isIOS'

export const getMajorVersionIOS = (): number => {
  if (Platform.OS !== 'ios') {
    throw Error('Platform is not iOS')
  }

  return parseInt(Platform.Version, 10)
}

export const isIOSAbove14 = isIOS && getMajorVersionIOS() > 14
