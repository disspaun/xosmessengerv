import { StatusUser } from '../../tm/Types'
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs'
import { memo, useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  createAnimatedPropAdapter,
  interpolateColor,
  processColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { RecentActivityAvatarBadgeStatus } from '@src/components/elements/indicators/RecentActivityAvatarBadgeStatus'

import { useEffectExceptOnMount } from '@src/hooks/common/useRenderedOnce'
import { AvailableColors, SVGComponent } from '@src/mytypes'
import { Box } from '@src/theme/helpers/Box'
import { fontStyles } from '@src/theme/text'
import { useAppTheme } from '@src/theme/theme'

interface ITabPart {
  label: string
  icon: SVGComponent
  status?: boolean
}

const tabPartStyles = StyleSheet.create({
  bubbleEffectStyle: { zIndex: 0, position: 'absolute', width: 120, height: 120, borderRadius: 60 },
  button: { alignItems: 'center', justifyContent: 'center', flex: 1, paddingBottom: 2 },
  container: { borderRadius: 48, overflow: 'hidden', flex: 1 },
})

const svgReanimatedFillPropAdapter = createAnimatedPropAdapter(
  (props) => {
    if (Object.keys(props).includes('fill')) {
      props.fill = { type: 0, payload: processColor(props.fill) }
    }
  },
  ['fill'],
)

export const TabPart = memo(({ label, icon, status, ...props }: BottomTabBarButtonProps & ITabPart) => {
  const { colors } = useAppTheme()
  const sharedValue = useSharedValue(0)

  const [fillColor, setFillColor] = useState<AvailableColors | undefined>(undefined)

  const onTouchStart = useCallback(() => {
    setFillColor(colors.white)
  }, [colors.white])

  const onTouchEnd = useCallback(() => {
    setTimeout(() => setFillColor(undefined), 250)
  }, [])

  useEffectExceptOnMount(() => {
    sharedValue.value = withTiming(fillColor ? 1 : 0, { duration: 150, easing: Easing.inOut(Easing.ease) })
  }, [fillColor])

  const animatedScale = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(sharedValue.value, {
            duration: 150,
            easing: Easing.inOut(Easing.ease),
          }),
        },
      ],
      backgroundColor: colors.accentColor,
    }
  }, [colors.accentColor])

  const textColor = props.accessibilityState?.selected ? colors.accentColor : colors.unselectedTabIconColor

  const animatedColor = useAnimatedStyle(() => {
    const color = interpolateColor(sharedValue.value, [1, 0], [colors.white, textColor])

    return {
      color,
    }
  }, [colors.white, textColor])

  const Icon = icon

  const iconColor = props.accessibilityState?.selected ? colors.iconHLcolor : colors.unselectedTabIconColor

  const animatedFill = useAnimatedProps(
    () => {
      const fill = interpolateColor(sharedValue.value, [1, 0], [colors.white, iconColor])

      return {
        fill,
      }
    },
    [iconColor],
    svgReanimatedFillPropAdapter,
  )

  return (
    // @ts-ignore // non conflicting amount of props
    <View style={tabPartStyles.container}>
      <Box
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        rippleColor={colors.backdrop}
        effect="none"
        {...props}
        style={tabPartStyles.button}
      >
        <>
          <Animated.View style={[tabPartStyles.bubbleEffectStyle, animatedScale]} />
          <Box justifyContent="center" mb={6} mt={8}>
            <Icon style={{ zIndex: 2 }} width={24} height={24} animatedProps={animatedFill} />
            {status ? (
              <RecentActivityAvatarBadgeStatus
                status={StatusUser.Available}
                backgroundColor={colors.mainBackground}
                size={12}
              />
            ) : null}
          </Box>
          <Animated.Text style={[fontStyles.tiny, animatedColor]}>{label}</Animated.Text>
        </>
      </Box>
    </View>
  )
})
