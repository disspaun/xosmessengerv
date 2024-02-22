import { RefObject, useCallback, useEffect } from 'react'
import { InteractionManager, Keyboard } from 'react-native'
import { TextInputSubmitEditingEventData } from 'react-native/Libraries/Components/TextInput/TextInput'
import { NativeSyntheticEvent } from 'react-native/Libraries/Types/CoreEventTypes'

import { CredentialsInput } from '@src/components/fields/CredentialsInputWithIcon'

export const useHandleInputTaps = (inputRefs: RefObject<Record<string, CredentialsInput>>) => {
  const handleKeyboardDidHide = useCallback(() => {
    if (!inputRefs.current) {
      return
    }
    Object.keys(inputRefs.current).forEach((key) => {
      inputRefs.current?.[key]?.input?.blur?.()
    })
  }, [])

  useEffect(() => {
    const keyboardWillHideSubscription = Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide)
    return keyboardWillHideSubscription.remove
  }, [])

  const continueSurvey = useCallback(
    (key: string) => (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      // e.nativeEvent.text
      InteractionManager.runAfterInteractions(() => {
        inputRefs.current?.[key]?.input?.focus?.()
      })
    },
    [],
  )

  return { continueSurvey }
}
