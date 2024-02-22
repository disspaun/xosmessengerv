import { Fragment } from 'react'
import { StyleSheet } from 'react-native'

import { AutoWidthImage } from '@src/components/elements/images/AutoWidthImage'
import { EmojisHashMap } from '@src/components/emojiBar/data'

import { Text, TextProps } from '@src/theme/themed'

const smileImgSize = 19.5

const styles = StyleSheet.create({
  smileImg: {
    resizeMode: 'contain',
    height: smileImgSize,
    width: 'auto',
    transform: [{ translateY: 2.5 }],
  },
  smileImgExtraTranslate: {
    resizeMode: 'contain',
    height: smileImgSize,
    width: 'auto',
    transform: [{ translateY: 3.5 }],
  },
  singleSmileImg: {
    resizeMode: 'contain',
    width: 'auto',
    height: 30,
  },
})

const encodeEmojiName = (text: string) => text.replace('[', '').replace(']', '')

export const ParsedText = ({
  text,
  enlargeSingleSmile = true,
  ...textProps
}: TextProps & { enlargeSingleSmile: boolean; text: string }) => {
  if (enlargeSingleSmile) {
    const singleSmile = EmojisHashMap.get(encodeEmojiName(text))
    if (singleSmile) {
      return <AutoWidthImage style={styles.singleSmileImg} source={singleSmile.emoji} />
    }
  }
  const splittedText = text.split(/(\[.*?\])/g)

  return (
    <Text {...textProps} android_hyphenationfrequency={'full'}>
      {splittedText.map((elem, index) => {
        if (!elem) return null
        const emoji = EmojisHashMap.get(encodeEmojiName(elem))
        if (emoji) {
          return (
            <Fragment key={`${elem}-${index}`}>
              {' '}
              <AutoWidthImage
                style={enlargeSingleSmile ? styles.smileImg : styles.smileImgExtraTranslate}
                source={emoji.emoji}
              />
              {' '}
            </Fragment>
          )
        }
        return elem
      })}
    </Text>
  )
}
