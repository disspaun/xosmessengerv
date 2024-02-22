import NativeUtopiaManager, { KeyInfo, Profile } from '../../tm/NativeUtopiaManager'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { documentDirectoryPath } from '@src/utils/file'

let _profile: Profile | null = null

export const initialize = () => {
  NativeUtopiaManager.initialize(`${documentDirectoryPath}/utopia`)
}

export const getAvailableProfiles = () => {
  return NativeUtopiaManager.availableProfiles()
}

export const removeProfile = (name: string) => {
  if (NativeUtopiaManager.hasProfile(name)) {
    return NativeUtopiaManager.removeProfile(name)
  }
}

interface IMakeProfile {
  name: string
  password: string
  keyInfo?: KeyInfo
}
export const makeProfile = async ({ name, password, keyInfo }: IMakeProfile): Promise<Profile> => {
  // optional keyInfo provided as undefined, specified by interface creator
  try {
    _profile = await NativeUtopiaManager.makeProfile(name, password, keyInfo)
    AsyncStorage.setItem('@last_logged_in_name/string', name).catch(() => {})
    return _profile
  } catch (e) {
    throw 'makeProfile error'
  }
}

export const clearProfile = () => {
  _profile = null
}

export const subscribeToProfile = <T extends keyof Profile>(eventName: T, callback: Profile[T]) => {
  if (!_profile) {
    return
  }
  _profile[eventName] = callback
}

export const modifyProfile = (profileData: Partial<Profile>) => {
  if (!_profile) {
    return
  }
  Object.keys(profileData).forEach((profileValue) => {
    _profile[profileValue] = profileData[profileValue]
  })
  return _profile
}
