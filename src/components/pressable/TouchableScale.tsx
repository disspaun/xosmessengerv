import { ComponentProps, ReactNode, useCallback, useMemo, useRef } from 'react'
import { Animated, Pressable, StyleProp, View, ViewStyle } from 'react-native'

interface TouchableScaleProps extends ComponentProps<typeof View> {
  animationDuration?: number
  scale?: number
  children?: ReactNode
  style?: StyleProp<ViewStyle>
  onPress?: (() => void) | undefined
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export const TouchableScale = ({
  animationDuration = 100,
  scale = 0.95,
  style,
  children,
  ...props
}: TouchableScaleProps) => {
  const animatedValue = useRef(new Animated.Value(1)).current

  const toSmall = useMemo(
    () =>
      Animated.timing(animatedValue, {
        toValue: scale,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    [animationDuration, scale, animatedValue],
  )

  const toNormal = useMemo(
    () =>
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    [animationDuration, animatedValue],
  )

  const handleTouchStart = useCallback(() => {
    toSmall.start()
  }, [toSmall])

  const handleTouchEnd = useCallback(() => {
    toNormal.start()
  }, [toNormal])

  return (
    <AnimatedPressable
      style={[style, { transform: [{ scale: animatedValue }] }]}
      {...props}
      onPressIn={handleTouchStart}
      onPressOut={handleTouchEnd}
    >
      {children}
    </AnimatedPressable>
  )
}
