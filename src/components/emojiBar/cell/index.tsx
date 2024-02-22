import { Emoji, Sticker } from '../interfaces'
import { memo } from 'react'
import { Image } from 'react-native'

import { selectEmoji, selectSticker } from '@src/components/emojiBar'

import { Box } from '@src/theme/helpers/Box'

interface IEmojiCell {
  emoji: { item: Emoji; weight: number }
  colSize: number
  isTextEmoji?: boolean
}

const handleEmojiClick = (emoji: { item: Emoji; weight: number }) => () => {
  selectEmoji(emoji)
}

export const EmojiCell = memo(({ emoji, colSize, isTextEmoji }: IEmojiCell) => {
  const spacing = isTextEmoji ? 2 : 2 * emoji.weight
  const width = isTextEmoji ? colSize : colSize * emoji.weight
  return (
    <Box
      activeOpacity={0.5}
      ml={spacing}
      mr={spacing}
      // w={colSize}
      h={colSize}
      alignItems="center"
      justifyContent="center"
      effect="gestureHandler"
      onPress={handleEmojiClick(emoji)}
    >
      <Image style={{ height: colSize, width, resizeMode: 'contain' }} source={emoji.item.emoji} />
    </Box>
  )
})

interface IStickerCell {
  sticker: Sticker
  colSize: number
}

const handleStickerClick = (sticker: Sticker) => () => {
  selectSticker(sticker)
}

export const StickerCell = memo(({ sticker, colSize }: IStickerCell) => (
  <Box
    activeOpacity={0.5}
    w={colSize}
    h={colSize}
    alignItems="center"
    justifyContent="center"
    effect="gestureHandler"
    onPress={handleStickerClick(sticker)}
  >
    <Image style={{ height: colSize, width: colSize, resizeMode: 'contain' }} source={sticker.sticker} />
  </Box>
))
