interface Emoji {
  category: string
  keywords: string[]
  name: string
  order: number
  emoji: number
}

interface Sticker {
  category: string
  keywords: string[]
  name: string
  order: number
  sticker: number
}

interface Category {
  key: string
  name: string
  id: number
  icon?: string
}

export type { Emoji, Category, Sticker }
