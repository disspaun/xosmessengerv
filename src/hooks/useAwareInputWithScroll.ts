import { RefObject, useCallback, useRef, useState } from 'react'
import { InteractionManager, LayoutChangeEvent, ScrollView, TextInput, findNodeHandle } from 'react-native'
import { LayoutRectangle } from 'react-native/Libraries/Types/CoreEventTypes'

export const useAwareInputWithScroll = (scrollViewRef: RefObject<ScrollView>, offset = 0, delay = 100) => {
  const [layoutRectangles, setLayoutRectangles] = useState<LayoutRectangle[]>([])
  const currentOffset = useRef(offset)
  const currentInput = useRef(0)

  const onLayout = useCallback(
    (index: number) => (e: LayoutChangeEvent) => {
      if (!e.nativeEvent) {
        return
      }
      const { layout } = e.nativeEvent
      setLayoutRectangles((prev) => {
        const newState = [...prev]
        newState[index] = layout
        return newState
      })
    },
    [],
  )

  const handleInputFocusedWithScrollview = useCallback(() => {
    InteractionManager.runAfterInteractions(() => {
      // TODO update
      const currentlyFocusedField = TextInput.State.currentlyFocusedField()

      if (scrollViewRef.current?.getScrollResponder().scrollResponderIsAnimating) {
        return
      }

      if (!currentlyFocusedField || currentlyFocusedField === currentInput.current) {
        return
      }

      currentInput.current = currentlyFocusedField

      scrollViewRef.current
        ?.getScrollResponder?.()
        .scrollResponderScrollNativeHandleToKeyboard(findNodeHandle(currentlyFocusedField), currentOffset.current, true)
    })
  }, [delay, scrollViewRef])

  const onFocus = useCallback(
    (index: number) => (layoutRectangle: LayoutRectangle) => {
      currentInput.current = 0
      currentOffset.current = (layoutRectangles?.[index]?.y || 0) + layoutRectangle.height + offset
    },
    [layoutRectangles, offset],
  )

  return { onLayout, onFocus, handleInputFocusedWithScrollview }
}
