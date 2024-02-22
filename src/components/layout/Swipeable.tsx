import React, { ReactNode } from 'react'
import { Dimensions } from 'react-native'
import { PanGestureHandler, PanGestureHandlerGestureEvent, PanGestureHandlerProps } from 'react-native-gesture-handler'
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

import { Box } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'

interface ISwipeable extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  children: ReactNode
  left: ReactNode
  right: ReactNode
  onRight: () => void
  onLeft: () => void
}

export const { width: SCREEN_WIDTH } = Dimensions.get('screen')
const OFFSET_VALUE_TRIGGER = -SCREEN_WIDTH * 0.5

export const Swipeable: React.FC<ISwipeable> = ({ children, left, right, onRight, onLeft, simultaneousHandlers }) => {
  const translateX = useSharedValue(0)
  const opacity = useSharedValue(0)
  const { colors } = useAppTheme()

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      translateX.value = event.translationX
    },
    onEnd: () => {
      const shouldBeRight = translateX.value < OFFSET_VALUE_TRIGGER
      const shouldBeleft = translateX.value > -OFFSET_VALUE_TRIGGER
      if (shouldBeRight) {
        translateX.value = withDelay(300, withTiming(0))
        opacity.value = withSequence(
          withTiming(1, undefined, (isFinished) => {
            if (isFinished && onRight) {
              runOnJS(onRight)()
            }
          }),
          withTiming(0),
        )
      } else if (shouldBeleft) {
        translateX.value = withDelay(300, withTiming(0))
        opacity.value = withSequence(
          withTiming(-1, undefined, (isFinished) => {
            if (isFinished && onLeft) {
              runOnJS(onLeft)()
            }
          }),
          withTiming(0),
        )
      } else {
        translateX.value = withTiming(0)
      }
    },
  })

  const leftIconContainer = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(opacity.value, [0, -1], [colors.swipeLeftColor, colors.swipeLeftHLColor])
    return {
      width: SCREEN_WIDTH,
      alignItems: 'flex-end',
      justifyContent: 'center',
      flex: 1,
      backgroundColor: backgroundColor,
    }
  }, [])

  const rightIconColor = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(opacity.value, [0, 1], [colors.swipeRightColor, colors.swipeRightHLColor])
    return {
      width: SCREEN_WIDTH,
      alignItems: 'flex-start',
      justifyContent: 'center',
      flex: 1,
      backgroundColor: backgroundColor,
    }
  }, [])

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }))

  return (
    <PanGestureHandler simultaneousHandlers={simultaneousHandlers} onGestureEvent={panGesture}>
      <Animated.View style={containerStyle}>
        <Box row w={SCREEN_WIDTH * 3} alignItems="center" justifyContent="center" alignSelf="center">
          <Box w={SCREEN_WIDTH} alignItems="center" justifyContent="center">
            <Animated.View style={leftIconContainer}>
              <Box mr={75}>{left}</Box>
            </Animated.View>
          </Box>
          <Box w={SCREEN_WIDTH} alignItems="center" justifyContent="center">
            {children}
          </Box>
          <Box w={SCREEN_WIDTH} alignItems="center" justifyContent="center">
            <Animated.View style={rightIconColor}>
              <Box ml={75}>{right}</Box>
            </Animated.View>
          </Box>
        </Box>
      </Animated.View>
    </PanGestureHandler>
  )
}
