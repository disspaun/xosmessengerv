import { memo } from 'react'
import { Image, ImageProps, ImageStyle } from 'react-native'

import { resolveAssetSource } from '@src/components/elements/images/ScalableImage'

export const AutoWidthImage = memo(({ style, ...imageProps }: { style: ImageStyle } & ImageProps) => {
  let width = style.width === 'auto' ? style.height : style.width
  if (style.width === 'auto') {
    const { width: imgWidth, height: imgHeight } = resolveAssetSource(imageProps.source)
    const multiply = imgWidth / imgHeight
    width = style.height * multiply
  }

  return (
    <Image
      {...imageProps}
      style={[
        style,
        {
          width,
        },
      ]}
    />
  )
})
