import { resolveAssetSource } from '@src/components/elements/images/ScalableImage'
import { Emojis, Stickers } from '@src/components/emojiBar/data'

export const RECENT = 'recent'
export const SEARCH = 'search'

export const categories = [
  { id: 0, key: RECENT, icon: 'recent', name: 'Recently used' },
  { id: 1, key: 'basic1', icon: 'basic1', name: 'Basic1' },
  { id: 2, key: 'basic2', icon: 'basic2', name: 'Basic2' },
  { id: 3, key: 'car', icon: 'car', name: 'Car' },
  { id: 4, key: 'adult', icon: 'adult', name: 'Adult' },
  { id: 5, key: 'space', icon: 'space', name: 'Space' },
  { id: 6, key: 'holiday', icon: 'holiday', name: 'Holiday' },
  { id: 7, key: 'sport', icon: 'sport', name: 'Sport' },
  { id: 8, key: 'food', icon: 'food', name: 'Food' },
  { id: 9, key: 'vip', icon: 'vip', name: 'Vip' },
  { id: 10, key: 'animal', icon: 'pets', name: 'Animal' },
  { id: 11, key: 'hands', icon: 'hand', name: 'Hands' },
  { id: 12, key: 'military', icon: 'military', name: 'Military' },
  { id: 13, key: 'electronics', icon: 'electronics', name: 'Electronics' },
  { id: 14, key: 'building', icon: 'building', name: 'Buildings' },
  { id: 15, key: 'apocalypse', icon: 'apocalypse', name: 'Apocalypse' },
  { id: 16, key: 'text', icon: 'text', name: 'Text' },
] as const

export const categoryKeys = categories.map((c) => c.key)

export const categoriesHashMap = new Map(
  categories.map((i) => {
    return [i.key, i]
  }),
)

export const widthSortedEmojis = Emojis.map((item) => {
  let weight = 1
  const imageAssetData = resolveAssetSource(item.emoji)
  if (imageAssetData.width > imageAssetData.height) {
    weight = 2
  }
  return { item, weight }
})

export const emojiDataByCategoryWidthSorted = new Map(
  categories.map((i) => {
    return [i.key, widthSortedEmojis.filter((e) => e.item.category.toLowerCase() === i.key.toLowerCase())]
  }),
)

export const stickerDataByCategory = new Map(
  categories.map((i) => {
    return [i.key, Stickers.filter((e) => e.category.toLowerCase() === i.key.toLowerCase())]
  }),
)
