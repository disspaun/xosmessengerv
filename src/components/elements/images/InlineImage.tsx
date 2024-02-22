import React, { memo } from 'react'
import { Image, ImageProps, PixelRatio, Platform, StyleSheet } from 'react-native'

const InlineImage = memo((props: ImageProps) => {
  let style = props.style

  if (style && Platform.OS !== 'ios') {
    style = Object.assign({}, StyleSheet.flatten(props.style))
    ;['height', 'width'].forEach((propName) => {
      if (style[propName]) {
        style[propName] = PixelRatio.getPixelSizeForLayoutSize(style[propName])
      }
    })
  }

  return <Image {...props} style={style} />
})

export { InlineImage }
