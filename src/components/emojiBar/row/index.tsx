import { EmojiCell, StickerCell } from '../cell'
import { Emoji, Sticker } from '../interfaces'
import React, { memo } from 'react'

import { Box } from '@src/theme/helpers/Box'

interface IEmojiRow {
  rowItems: { item: Emoji; weight: number }[]
  colSize: number

  isTextEmoji?: boolean
}

export const EmojiRow = memo(({ rowItems, colSize, isTextEmoji }: IEmojiRow) => {
  return (
    <Box row>
      {rowItems.map((emoji) => (
        <EmojiCell isTextEmoji={isTextEmoji} key={emoji.item.name} emoji={emoji} colSize={colSize} />
      ))}
    </Box>
  )
})

interface IStickerRow {
  rowItems: Sticker[]
  colSize: number
}

export const StickerRow = memo(({ rowItems, colSize }: IStickerRow) => {
  return (
    <Box row>
      {rowItems.map((sticker) => (
        <StickerCell key={sticker.name} sticker={sticker} colSize={colSize} />
      ))}
    </Box>
  )
})
