import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { Chat } from '@src/draft/types'
import { LocalizationKeys } from '@src/locales/localization'
import { AvailableIcons } from '@src/mytypes'

export type RootStackParamList = {
  tabs: undefined
  chat: {
    chat: Chat
  }
  share: { uri: string; mimeType: string; text: string; fileName?: string }
  mediaSettings: undefined
  security: undefined
  processing: undefined
  addContact: undefined
  singleField: {
    action: (value: string) => void
    title: string
    icon?: AvailableIcons
    description?: string
    value?: string
  }
  scanCode: undefined
  contacts: undefined
}

export type UnauthorizedStackParamList = {
  intro: undefined
  signUp: undefined
  signIn: undefined
  startup: { name: string; textKey?: LocalizationKeys }
  deleteAccount: { name: string }
  importAccount: undefined
  importAccountForm: undefined
  importAccountConfirm: undefined
}

export type TabsParamList = {
  chatsTab: undefined
  profileTab: undefined
}

export type HomeStackParamList = {
  chats: undefined
}

export type ProfileStackParamList = {
  profile: undefined
}

export type AllStackParamList = RootStackParamList &
  HomeStackParamList &
  ProfileStackParamList &
  UnauthorizedStackParamList

export type AvailableRoutes = keyof AllStackParamList

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AllStackParamList {}
  }
}

export type ScreenProps<Screen extends keyof AllStackParamList> = NativeStackScreenProps<AllStackParamList, Screen>
