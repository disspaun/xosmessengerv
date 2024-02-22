import React, { memo, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Image, ImageProps, StyleSheet, ViewStyle } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

import { PlatformBlur } from '@src/components/layout'

import { basicStyles } from '@src/theme/basicStyles'
import { Box } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'
import { anonymouseVoidFunction } from '@src/utils/expressions'
import { isIOS } from '@src/utils/isIOS'

export const resolveAssetSource = Image.resolveAssetSource

interface IOnSizeParams {
  width: number
  height: number
}

interface IScalableImage {
  source: ImageProps['source']
  messageWidth: number
  originalWidth: number
  originalHeight: number
  width: number
  height: number
  onSize?: (onSizeParams: IOnSizeParams) => void
  style?: ViewStyle
  onPress?: () => void
}

const resizeParams = new Map<string, IOnSizeParams>()

export const ScalableImage = memo(
  ({ width, height, onSize, source, style, messageWidth, originalHeight, originalWidth, onPress }: IScalableImage) => {
    const initResizeParams = useRef(resizeParams.get(source?.uri))
    const [scalableWidth, setScalableWidth] = useState<number>(initResizeParams.current?.width || width)
    const [scalableHeight, setScalableHeight] = useState<number>(initResizeParams.current?.height || height)
    const { dark } = useAppTheme()

    useLayoutEffect(() => {
      //  TODO if no original parameters provided
      // resolveImageParameters({ source })
      adjustSize(originalWidth, originalHeight, width, height)
    }, [])

    const resolveImageParameters = useCallback(
      ({ source }) => {
        if (source.uri) {
          const sourceToUse = source.uri ? source.uri : source

          Image.getSize(sourceToUse, (_width, _height) => adjustSize(_width, _height, width, height), console.error)
        } else {
          const sourceToUse = resolveAssetSource(source)
          adjustSize(sourceToUse.width, sourceToUse.height, width, height)
        }
      },
      [width, height],
    )

    const adjustSize = (sourceWidth: number, sourceHeight: number, width?: number, height?: number) => {
      if (initResizeParams.current) {
        return
      }

      let ratio = 1

      if (width && height) {
        ratio = Math.min(width / sourceWidth, height / sourceHeight)
      } else if (width) {
        ratio = width / sourceWidth
      } else if (height) {
        ratio = height / sourceHeight
      }

      const computedWidth = sourceWidth * ratio
      const computedHeight = sourceHeight * ratio

      setScalableWidth(computedWidth)
      setScalableHeight(computedHeight)

      resizeParams.set(source?.uri, { width: computedWidth, height: computedHeight })

      onSize?.({ width: computedWidth, height: computedHeight })
    }

    const renderBackground = useMemo(() => {
      if (!scalableHeight || !scalableWidth) {
        return null
      }
      if (messageWidth <= scalableWidth) {
        return null
      }

      if (isIOS) {
        return (
          <>
            <Image
              key="backImage"
              style={basicStyles.absolute}
              source={source}
              width={messageWidth}
              height={scalableHeight}
            />
            <PlatformBlur
              reducedTransparencyFallbackColor="white"
              blurAmount={9}
              overlayColor={'undefined'} // workaround
              blurType={dark ? 'dark' : 'light'}
              style={[StyleSheet.absoluteFill, { width: messageWidth, height: scalableHeight }]}
            />
          </>
        )
      }
      return (
        <Image
          key="backImage"
          style={basicStyles.absolute}
          source={source}
          width={messageWidth}
          blurRadius={9}
          height={scalableHeight}
        />
      )
    }, [source, scalableHeight, scalableWidth, messageWidth, dark])

    const gesture = useMemo(() => Gesture.Tap().onStart(onPress).onTouchesCancelled(anonymouseVoidFunction), [onPress])

    return (
      <GestureDetector gesture={gesture}>
        <Box activeOpacity={0.7}>
          {renderBackground}
          <Image
            key="frontImage"
            source={source}
            style={[
              style,
              {
                width: scalableWidth,
                height: scalableHeight,
              },
            ]}
          />
        </Box>
      </GestureDetector>
    )
  },
)
