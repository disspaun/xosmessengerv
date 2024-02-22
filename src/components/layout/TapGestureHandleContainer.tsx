import { ReactElement, cloneElement, useMemo } from 'react'
import { View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

interface ITapGestureHandleContainer {
  onTap: () => void
  children: ReactElement
}

export const TapGestureHandleContainer = ({ onTap, children }: ITapGestureHandleContainer) => {
  const gesture = useMemo(() => Gesture.Tap().onEnd(onTap), [onTap])

  return (
    <GestureDetector gesture={gesture}>
      <View collapsable={false}>{cloneElement(children, { onPress: () => {} })}</View>
    </GestureDetector>
  )
}
