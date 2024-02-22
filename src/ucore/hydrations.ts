import { getGenericPassword, setGenericPassword } from 'react-native-keychain'

import { LocalizationKeys } from '@src/locales/localization'
import { dispatchProfile } from '@src/providers/ProfileProvider'
import { navigationRef } from '@src/routing/navigationRef'
import { makeProfile } from '@src/ucore/actions'

export const setupProfile = async (data: { name: string; password: string; textKey?: LocalizationKeys }) => {
  return makeProfile(data)
    .then(async (profile) => {
      dispatchProfile?.({ type: 'SET_PROFILE', profile })
      navigationRef.navigate('startup', data)
      await setGenericPassword(data.name, data.password)
      return null
    })
    .catch((e) => {
      return { error: e }
    })
}

export const restoreProfile = async (data: { name: string }) => {
  try {
    const credentials = await getGenericPassword()
    if (credentials && credentials.username === data.name) {
      makeProfile({ name: credentials.username, password: credentials.password })
        .then((profile) => {
          dispatchProfile?.({ type: 'SET_PROFILE', profile })
        })
        .catch(() => {
          alert('Profile restore error occurred')
        })
    } else {
      console.log('No credentials stored')
    }
  } catch (error) {
    alert("Keychain couldn't be accessed!\n" + JSON.stringify(error))
  }
}
