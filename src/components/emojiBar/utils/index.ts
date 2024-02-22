import { Emoji, Sticker } from '../interfaces'

import { RECENT } from '@src/components/emojiBar/constants'

// chunk emojis into arrays for each row
export const chunkByRows = (items: Emoji[] | Sticker[], key: string, chunkSize = 7, chunkEmojiByWidth = false) => {
  const chunkedArr = []
  if (items?.length) {
    if (chunkEmojiByWidth) {
      let _overall = chunkSize
      let _pendingArray = []
      for (let i = 0; i < items.length; i++) {
        const currentItem = items[i]
        if (_overall - currentItem.weight >= 0) {
          _pendingArray.push(currentItem)
          _overall -= currentItem.weight
        } else {
          chunkedArr.push({ key: key + '-' + i, category: key, data: _pendingArray })
          _pendingArray = [currentItem]
          _overall = chunkSize - currentItem.weight
        }
        if (i === items.length - 1) {
          chunkedArr.push({ key: key + '-' + i, category: key, data: _pendingArray })
        }
      }
    } else {
      for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize)
        chunkedArr.push({ key: key + '-' + i, category: key, data: chunk })
      }
    }
  }
  return chunkedArr
}

interface Props {
  itemHeight: number
  separatorHeight?: number
  sectionHeaderHeight?: number
  sectionFooterHeight?: number
  listHeaderHeight?: number
  listFooterHeight?: number
  sections: any
  index: number
}

export const calcSectionItemLayout = ({
  itemHeight = 0,
  separatorHeight = 0,
  sectionHeaderHeight = 0,
  sectionFooterHeight = 0,
  listHeaderHeight = 0,
  listFooterHeight = 0,
  sections = [],
  index = 0,
}: Props) => {
  let length = listHeaderHeight!,
    offset = 0,
    currentIndex = 0
  while (currentIndex < index) {
    offset += length
    if (currentIndex > 0) length = listFooterHeight
    currentIndex++
    const sectionsLength = sections.length
    for (let sectionIndex = 0; sectionIndex < sectionsLength && currentIndex < index; sectionIndex++) {
      offset += length
      length = sectionHeaderHeight
      currentIndex++
      const sectionData = sections[sectionIndex].data
      const dataLength = sectionData.length
      for (let dataIndex = 0; dataIndex < dataLength && currentIndex < index; dataIndex++) {
        offset += length
        const separator_height = dataIndex < dataLength - 1 ? separatorHeight : 0
        length = itemHeight + separator_height
        currentIndex++
      }
      if (!dataLength && currentIndex < index) {
        offset += length
        length = sectionFooterHeight
        currentIndex++
      }
    }
  }
  return {
    index,
    length,
    offset,
  }
}
