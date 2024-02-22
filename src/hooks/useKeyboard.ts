import { useCallback, useEffect, useState } from 'react'
import { EmitterSubscription, Keyboard, KeyboardEventListener, KeyboardMetrics } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { NativeEventSubscription } from 'react-native/Libraries/EventEmitter/RCTNativeAppEventEmitter'

import { dismissInputPanelIfVisible } from '@src/components/controls/MessageInput'

import { useAppStateChangeWithCallbacks } from '@src/hooks/useAppStateChangeWithCallbacks'
import { resetHeightRef } from '@src/providers/SystemProvider'

const emptyCoordinates = Object.freeze({
  screenX: 0,
  screenY: 0,
  width: 0,
  height: 0,
})
const initialValue = {
  start: emptyCoordinates,
  end: emptyCoordinates,
}
export let keyboardHeightRef = 0

export const dismissInputPanel = () => {
  Keyboard.dismiss()
  dismissInputPanelIfVisible()
}

export function useKeyboard() {
  const [shown, setShown] = useState(false)
  const keyboardHeightSV = useSharedValue(0)
  const [coordinates, setCoordinates] = useState<{
    start: undefined | KeyboardMetrics
    end: KeyboardMetrics
  }>(initialValue)
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0)
  keyboardHeightRef = keyboardHeight

  const handleKeyboardWillShow: KeyboardEventListener = useCallback((e) => {
    setCoordinates({ start: e.startCoordinates, end: e.endCoordinates })
  }, [])
  const handleKeyboardDidShow: KeyboardEventListener = useCallback((e) => {
    setShown(true)
    setCoordinates({ start: e.startCoordinates, end: e.endCoordinates })
    setKeyboardHeight(e.endCoordinates.height)
    keyboardHeightSV.value = e.endCoordinates.height
  }, [])
  const handleKeyboardWillHide: KeyboardEventListener = useCallback((e) => {
    setCoordinates({ start: e.startCoordinates, end: e.endCoordinates })
  }, [])
  const handleKeyboardDidHide: KeyboardEventListener = useCallback((e) => {
    setShown(false)
    if (e) {
      setCoordinates({ start: e.startCoordinates, end: e.endCoordinates })
    } else {
      setCoordinates(initialValue)
      setKeyboardHeight(0)
    }
  }, [])

  useAppStateChangeWithCallbacks(dismissInputPanel, resetHeightRef)

  useEffect(() => {
    const subscriptions = [
      Keyboard.addListener('keyboardWillShow', handleKeyboardWillShow),
      Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow),
      Keyboard.addListener('keyboardWillHide', handleKeyboardWillHide),
      Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide),
    ] as (EmitterSubscription | NativeEventSubscription)[]

    return () => {
      subscriptions.forEach((subscription) => subscription.remove())
    }
  }, [])

  return {
    keyboardHeightSV,
    keyboardShown: shown,
    coordinates,
    keyboardHeight,
  }
}
