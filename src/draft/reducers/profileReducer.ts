import { Profile } from '../../../tm/NativeUtopiaManager'

export type ProfileActions =
  | ({ type: 'SET_PROFILE' } & { profile: Profile })
  | ({ type: 'UPDATE_PROFILE' } & { profile: Partial<Profile> })

export function profileReducer(draft: Profile | null, action: ProfileActions) {
  switch (action.type) {
    case 'SET_PROFILE': {
      draft = action.profile
      break
    }
    case 'UPDATE_PROFILE': {
      draft &&
        Object.keys(action.profile).forEach((profileValue) => {
          draft[profileValue] = action.profile[profileValue]
        })
      break
    }
  }
  return draft
}
