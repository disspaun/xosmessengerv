import { Dispatch, ReactNode, SetStateAction, createContext, useCallback, useContext, useState } from 'react'
import { Easing, SharedValue, useAnimatedKeyboard, withTiming } from 'react-native-reanimated'
import { KeyboardState } from 'react-native-reanimated/src/reanimated2/commonTypes'

import { useKeyboard } from '@src/hooks/useKeyboard'

export interface ISystemProvider {
  keyboardState: Partial<ReturnType<typeof useKeyboard>>
  height: SharedValue<number> | { value: 0 }
  state: SharedValue<KeyboardState> | { value: KeyboardState.CLOSED }
  chatScrollOffset: number
  setChatScrollOffset: Dispatch<SetStateAction<number>>
}

export const SystemContext = createContext<ISystemProvider>({
  keyboardState: {},
  height: { value: 0 },
  state: { value: KeyboardState.CLOSED },
  chatScrollOffset: 0,
  setChatScrollOffset: () => {},
})

export let resetHeightRef: () => void

export const SystemProvider = ({ children }: { children?: ReactNode }) => {
  const keyboardState = useKeyboard()
  const { height, state } = useAnimatedKeyboard()
  const [chatScrollOffset, setChatScrollOffset] = useState(0)

  resetHeightRef = useCallback(() => {
    height.value = withTiming(0, {
      duration: 150,
      easing: Easing.inOut(Easing.linear),
    })
  }, [])

  return (
    <SystemContext.Provider value={{ keyboardState, height, state, chatScrollOffset, setChatScrollOffset }}>
      {children}
    </SystemContext.Provider>
  )
}

export const useSystemProvider = () => useContext(SystemContext)

export const useSystemKeyboardProvider = () => useContext(SystemContext).keyboardState
export const useReanimatedKeyboardAnimationHeight = () => useContext(SystemContext).height
export const useReanimatedKeyboardAnimationState = () => useContext(SystemContext).state
export const useSystemOpenedChatScrollOffset = () => useContext(SystemContext).chatScrollOffset
export const useSystemOpenedSetChatScrollOffset = () => useContext(SystemContext).setChatScrollOffset
