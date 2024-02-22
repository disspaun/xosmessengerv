import { Profile } from '../../tm/NativeUtopiaManager'
import NativeUtopiaUtils from '../../tm/NativeUtopiaUtils'
import { StatusUser } from '../../tm/Types'
import { Dispatch, ReactNode, ReducerAction, createContext, useContext, useEffect, useMemo } from 'react'
import { useImmerReducer } from 'use-immer'

import { ProfileActions, profileReducer } from '@src/draft/reducers/profileReducer'
import { subscribeToProfile } from '@src/ucore/actions'

export interface IProfileProvider {
  profile: Profile | null
  publicKey: string
}

export const ProfileContext = createContext<IProfileProvider>({
  profile: null,
  publicKey: '',
})

export let dispatchProfile: Dispatch<ReducerAction<typeof profileReducer>> | null = null

export const ProfileProvider = ({ children }: { children?: ReactNode }) => {
  const [profile, profileDispatch] = useImmerReducer<Profile | null, ProfileActions>(profileReducer, null)

  useEffect(() => {
    subscribeToProfile('onPushEnabled', (state: boolean) => {
      profileDispatch({ type: 'UPDATE_PROFILE', profile: { pushEnabled: state } })
    })
    subscribeToProfile('onStatusChanged', (status: StatusUser) => {
      profileDispatch({ type: 'UPDATE_PROFILE', profile: { status } })
    })
  }, [])

  const publicKey = useMemo(
    () => (profile?.keyInfo?.publicKey ? NativeUtopiaUtils.stringifyByteArray(profile.keyInfo.publicKey) : ''),
    [profile?.keyInfo?.publicKey],
  )

  useEffect(() => {
    dispatchProfile = profileDispatch
  }, [profileDispatch])
  return <ProfileContext.Provider value={{ profile, publicKey }}>{children}</ProfileContext.Provider>
}

export const useProfileProvider = () => useContext(ProfileContext)
