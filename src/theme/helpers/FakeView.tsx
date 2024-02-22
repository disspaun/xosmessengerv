import { ReactNode, useCallback, useMemo } from 'react'
import { Platform } from 'react-native'
import Animated, { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { KeyboardState } from 'react-native-reanimated/src/reanimated2/commonTypes'

import { useMemoizedAnimatedStyle } from '@src/hooks/reanimated/useMemoizedAnimatedStyle'
import {
  useReanimatedKeyboardAnimationHeight,
  useReanimatedKeyboardAnimationState,
} from '@src/providers/SystemProvider'
import { Box, BoxProps } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'

export const FakeView = ({
  calcWithInsets,
  additionalOffset,
}: {
  calcWithInsets?: boolean
  additionalOffset?: number
}) => {
  const height = useReanimatedKeyboardAnimationHeight()
  const { insets } = useAppTheme()

  const fakeView = useMemoizedAnimatedStyle(
    useCallback(() => {
      'worklet'
      return {
        height: calcWithInsets
          ? Math.abs(height.value ? height.value + insets.bottom : 0)
          : Math.abs(height.value) + (additionalOffset || 0),
      }
    }, [calcWithInsets, height, additionalOffset]),
  )

  return <Animated.View style={fakeView} />
}

export const KeyboardOffset = ({ children, additionalOffset }: { children?: ReactNode; additionalOffset?: number }) => {
  const height = useReanimatedKeyboardAnimationHeight()

  const offsetStyle = useAnimatedStyle(
    () => ({
      position: 'absolute',
      bottom: Math.abs(height.value) + (additionalOffset || 0),
    }),
    [height, additionalOffset],
  )

  return <Animated.View style={offsetStyle}>{children}</Animated.View>
}

export const TranslateYOffset = ({
  children,
  additionalOffset,
}: {
  children?: ReactNode
  additionalOffset?: number
}) => {
  const height = useReanimatedKeyboardAnimationHeight()

  const offsetStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: -(additionalOffset || 0) }],
    }),
    [height, additionalOffset],
  )

  return <Animated.View style={offsetStyle}>{children}</Animated.View>
}

export const SmoothHeight = ({
  children,
  height,
  ...boxProps
}: { children?: ReactNode; height: number } & BoxProps) => {
  const _height = useReanimatedKeyboardAnimationHeight()
  const _state = useReanimatedKeyboardAnimationState()
  const { colors, insets } = useAppTheme()

  const componentHeight = height

  const extraOffset = Platform.select({ default: 0, android: insets.bottom })

  const containerStyle = useMemo(() => ({ backgroundColor: colors.mainBackground }), [colors.backgroundColor])

  const animatedHeight = useMemoizedAnimatedStyle(
    useCallback(() => {
      'worklet'

      const isOpening = _state.value === KeyboardState.OPENING

      if (isOpening && !componentHeight) {
        return {
          height: Math.abs(_height.value) + extraOffset,
        }
      }

      return {
        height: withTiming(componentHeight, {
          duration: isOpening ? 0 : 150,
          easing: Easing.linear,
        }),
      }
    }, [extraOffset, componentHeight]),
  )

  return (
    <Animated.View style={[animatedHeight, containerStyle]}>
      <Box flex {...boxProps}>
        {children}
      </Box>
    </Animated.View>
  )
}
