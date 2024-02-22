import { Icons } from '@assets'
import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll/src/CameraRoll'
import { memo, useCallback } from 'react'
import { useWindowDimensions } from 'react-native'
import { Easing, withTiming } from 'react-native-reanimated'
import Animated from 'react-native-reanimated'

import { useMemoizedAnimatedStyle } from '@src/hooks/reanimated/useMemoizedAnimatedStyle'
import { Box } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'

export interface ICameraRollGalleryItem {
  item: PhotoIdentifier['node']['image']
  handleAsset: (asset: PhotoIdentifier['node']['image']) => () => void
  isPicked: boolean
}

export const CameraRollGalleryItem = memo(({ item, handleAsset, isPicked }: ICameraRollGalleryItem) => {
  const dimensions = useWindowDimensions()
  const itemWidth = dimensions.width / 3 - 4
  const { colors } = useAppTheme()

  const animatedScale = useMemoizedAnimatedStyle(
    useCallback(() => {
      'worklet'

      return {
        transform: [
          {
            scale: withTiming(isPicked ? 0.8 : 1, {
              duration: 150,
              easing: Easing.linear,
            }),
          },
        ],
      }
    }, [isPicked]),
  )

  return (
    <Box
      justifyContent="center"
      alignItems="center"
      backgroundColor={colors.dividerColor}
      w={itemWidth}
      ml={4}
      mb={4}
      effect="scale"
      onPress={handleAsset(item)}
    >
      {isPicked ? (
        <Box absolute zIndex={2} top={8} right={8}>
          <Icons.svg.selectContact width={24} height={24} fill={colors.confirmButtonColor} />
        </Box>
      ) : null}
      <Animated.Image style={animatedScale} width={itemWidth} height={itemWidth} source={{ uri: item.uri }} />
    </Box>
  )
})
