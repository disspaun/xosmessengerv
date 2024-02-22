import { ViewToken } from '@react-native/virtualized-lists/Lists/VirtualizedList'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, SectionList } from 'react-native'
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'

import { appendEmoji } from '@src/components/controls/MessageInput'
import { ActivityIndicatorThemed } from '@src/components/elements/indicators/ActivityIndicatorThemed'
import { SwitchPanel } from '@src/components/emojiBar/switchPanel/SwitchPanel'

import { useEffectExceptOnMount } from '@src/hooks/common/useRenderedOnce'
import { useParsedStorage } from '@src/hooks/useAsyncStorage'
import { useSystemKeyboardProvider } from '@src/providers/SystemProvider'
import { basicStyles } from '@src/theme/basicStyles'
import { Box } from '@src/theme/helpers/Box'
import { Divider } from '@src/theme/helpers/Divider'
import { FakeView } from '@src/theme/helpers/FakeView'

import {
  RECENT,
  categories,
  categoriesHashMap,
  emojiDataByCategoryWidthSorted,
  stickerDataByCategory,
} from './constants'
import { Category, Emoji, Sticker } from './interfaces'
import { EmojiRow, StickerRow } from './row'
import SectionHeader from './sectionHeader'
import { EmojiTabBar } from './tabBar'
import { chunkByRows } from './utils'

export const emojiFromUtf16 = (utf16: string) => String.fromCodePoint(...(utf16.split('-').map((u) => '0x' + u) as any))

type CategoryKey = `${(typeof categories)[number]['key']}`
interface Props {
  autoFocus: boolean
  perLine: number
  perLineStickers: number
  onSelectSticker(sticker: Sticker): void

  backgroundColor?: string
}

export const EMOJI_BAR_MAX_HEIGHT = Dimensions.get('window').height * 0.75
const EMOJI_BAR_CONTENT_WIDTH = Dimensions.get('screen').width - 32

export let selectEmojiRef = null
export let selectStickerRef = null

export const selectEmoji = (emoji: { item: Emoji; weight: number }) => {
  selectEmojiRef?.(emoji)
}

export const selectSticker = (sticker: Sticker) => {
  selectStickerRef?.(sticker)
}

const commonCategories = categories.filter((category) => category.key !== RECENT)

const EmojiPicker = memo(
  ({
    perLine,
    perLineStickers,
    onSelectSticker = (sticker: Sticker) => null,

    backgroundColor = undefined,
  }: Props) => {
    const colSize = Math.floor(EMOJI_BAR_CONTENT_WIDTH / perLine - 4)
    const colSizeTextEmoji = Math.floor(EMOJI_BAR_CONTENT_WIDTH / 6 - 4)
    const colSizeStickers = Math.floor(EMOJI_BAR_CONTENT_WIDTH / perLineStickers)
    const [init, setInit] = useState(false)
    const [displayStickers, setDisplayStickers] = useState(false)
    const [category, setCategory] = useState<Category>(categoriesHashMap.get(RECENT))

    const [recent, setRecent] = useParsedStorage('recent@emoji_picker_v2')
    const [recentStickers, setRecentStickers] = useParsedStorage('recent_stickers@emoji_picker_v2')

    const [_recent, _setRecent] = useState(recent)
    const [_recentStickers, _setRecentStickers] = useState(recentStickers)
    const categoryScrollTimeout = useRef<number>(null)
    const scrollToSectionTimeout = useRef<number>(null)
    const initTimeout = useRef<number>(null)

    const emojiSectionListRef = useRef<SectionList>(null)
    const stickerSectionListRef = useRef<SectionList>(null)
    const { keyboardShown } = useSystemKeyboardProvider()

    useEffect(() => {
      _setRecent(recent)
      _setRecentStickers(recentStickers)

      if (!init) {
        initTimeout.current = setTimeout(() => {
          setInit(true)
        }, 500)
      }
    }, [init, displayStickers, keyboardShown])

    const onCategoryChange = useCallback(
      (category: Category, animated = true) =>
        () => {
          categoryScrollTimeout.current && clearTimeout(categoryScrollTimeout.current)
          categoryScrollTimeout.current = setTimeout(() => {
            setCategory(category)
            categoryScrollTimeout.current = null
          }, 250)
          const controlledSectionListRef = displayStickers ? stickerSectionListRef : emojiSectionListRef
          controlledSectionListRef.current?.scrollToLocation({
            animated,
            sectionIndex: category.id,
            itemIndex: 0,
          })
        },
      [displayStickers],
    )

    const changeTab = useCallback(
      (value: boolean) => () => {
        setDisplayStickers(value)
      },
      [],
    )

    useEffectExceptOnMount(() => {
      category && onCategoryChange(category)()
    }, [displayStickers])

    useEffect(() => {
      return () => {
        initTimeout.current && clearTimeout(initTimeout.current)
        categoryScrollTimeout.current && clearTimeout(categoryScrollTimeout.current)
        scrollToSectionTimeout.current && clearTimeout(scrollToSectionTimeout.current)
        selectEmojiRef = null
        selectStickerRef = null
      }
    }, [])

    const { sections } = useMemo(() => {
      // TODO hashmap or something
      const emojiList = {} // map of emojis to categories
      commonCategories.forEach((category) => {
        const key = category.key
        const isTextCategorySmile = key === 'text'
        emojiList[key] = chunkByRows(
          emojiDataByCategoryWidthSorted.get(key),
          key,
          isTextCategorySmile ? 6 : perLine,
          !isTextCategorySmile,
        )
      })
      const sections = commonCategories.map((category) => ({
        name: category.name,
        key: category.key,
        data: emojiList[category.key],
      }))
      return { sections }
    }, [perLine])

    const { stickerSections } = useMemo(() => {
      // TODO hashmap or something
      const stickerList = {} // map of emojis to categories
      commonCategories.forEach((category) => {
        const key = category.key
        stickerList[key] = chunkByRows(stickerDataByCategory.get(key), key, perLineStickers)
      })
      const stickerSections = commonCategories.map((category) => ({
        name: category.name,
        key: category.key,
        data: stickerList[category.key],
      }))
      return { stickerSections }
    }, [perLineStickers])

    const { stickerRecentSections } = useMemo(() => {
      const list = _recentStickers
      const stickersList = chunkByRows(list, 'recent', perLineStickers)

      const stickerRecentSections = {
        name: 'Recently used',
        key: 'recent',
        data: stickersList,
      }

      return { stickerRecentSections }
    }, [_recentStickers, perLineStickers])

    const { emojiRecentSections } = useMemo(() => {
      const list = _recent

      const emojiList = chunkByRows(list, 'recent', perLine, true)

      const emojiRecentSections = {
        name: 'Recently used',
        key: 'recent',
        data: emojiList,
      }

      return { emojiRecentSections }
    }, [_recent, perLine])

    const addToRecentStickers = useCallback(
      (sticker: Sticker) => {
        const _recentStickers = recentStickers || []

        const newRecent: Sticker[] = []
        const existing = _recentStickers.find((h) => h.name === sticker.name)
        if (existing) {
          // if already saved, bump to the front
          const filtered = _recentStickers.filter((h) => h.name !== sticker.name)
          newRecent.push(sticker, ...filtered)
        } else {
          // add to the front
          newRecent.push(sticker, ..._recentStickers)
        }
        setRecentStickers?.(newRecent.splice(0, 10))
      },
      [recentStickers, setRecentStickers],
    )

    const addToRecent = useCallback(
      (emoji: { item: Emoji; weight: number }) => {
        const _recent = recent || []

        const newRecent: Emoji[] = []
        const existing = _recent.find((h) => h.item.name === emoji.item.name)
        if (existing) {
          // if already saved, bump to the front
          const filtered = _recent.filter((h) => h.item.name !== emoji.item.name)
          newRecent.push(emoji, ...filtered)
        } else {
          // add to the front
          newRecent.push(emoji, ..._recent)
        }
        setRecent?.(newRecent.splice(0, 20))
      },
      [recent, setRecent],
    )

    selectEmojiRef = useCallback(
      (emoji: { item: Emoji; weight: number }) => {
        appendEmoji(emoji.item)
        addToRecent(emoji)
      },
      [addToRecent],
    )

    selectStickerRef = useCallback(
      (sticker: Sticker) => {
        onSelectSticker(sticker)
        addToRecentStickers(sticker)
      },
      [onSelectSticker, addToRecentStickers],
    )

    const renderSectionHeader = ({ section }: { section: any }) => <SectionHeader name={section.name} />

    const renderEmojiRow = useCallback(
      ({ item }: { item: { key: string; data: { item: Emoji; weight: number }[] } }) => {
        const isTextEmoji = item.key.includes('text')
        return (
          <EmojiRow rowItems={item.data} colSize={isTextEmoji ? colSizeTextEmoji : colSize} isTextEmoji={isTextEmoji} />
        )
      },
      [],
    )

    const renderStickerRow = useCallback(
      ({ item }: { item: { key: string; data: Sticker[] } }) => (
        <StickerRow rowItems={item.data} colSize={colSizeStickers} />
      ),
      [],
    )

    const getItemLayout = useCallback(
      (size: number, emoji: boolean) =>
        sectionListGetItemLayout({
          getItemHeight: (rowData, sectionIndex, rowIndex) => (sectionIndex === 15 && emoji ? colSizeTextEmoji : size),
          getSectionHeaderHeight: () => 26,
        }),
      [colSizeTextEmoji],
    )

    const onViewableItemsChanged = useCallback(
      (info: { viewableItems: Array<ViewToken>; changed: Array<ViewToken> }) => {
        if (categoryScrollTimeout.current) {
          return
        }
        const viewPointCategory = info.viewableItems?.[0]?.key

        if (viewPointCategory) {
          const categoryKey = viewPointCategory.split('-')[0]
          const category = categoriesHashMap.get(categoryKey)
          category && setCategory(category)
        }
      },
      [],
    )

    return (
      <Box w="screen" flex={true} backgroundColor={backgroundColor}>
        <Divider flex={undefined} />
        <EmojiTabBar activeCategory={category} onPress={onCategoryChange} categories={categories} />
        <Divider flex={undefined} />

        <Box mr={16} ml={16} flex>
          {init ? (
            displayStickers ? (
              <SectionList
                style={basicStyles.flex}
                sections={[stickerRecentSections, ...stickerSections]}
                keyExtractor={(item) => item.key}
                windowSize={2}
                initialNumToRender={2}
                maxToRenderPerBatch={2}
                updateCellsBatchingPeriod={2}
                onEndReachedThreshold={0.5}
                renderItem={renderStickerRow}
                renderSectionHeader={renderSectionHeader}
                ListFooterComponent={<FakeView additionalOffset={32} />}
                stickySectionHeadersEnabled={false}
                getItemLayout={getItemLayout(colSizeStickers, false)}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                removeClippedSubviews
                ref={stickerSectionListRef}
              />
            ) : (
              <SectionList
                style={basicStyles.flex}
                sections={[emojiRecentSections, ...sections]}
                keyExtractor={(item) => item.key}
                windowSize={5}
                initialNumToRender={5}
                maxToRenderPerBatch={3}
                updateCellsBatchingPeriod={3}
                renderItem={renderEmojiRow}
                renderSectionHeader={renderSectionHeader}
                ListFooterComponent={<FakeView additionalOffset={32} />}
                stickySectionHeadersEnabled={false}
                getItemLayout={getItemLayout(colSize, true)}
                viewabilityConfig={{
                  itemVisiblePercentThreshold: 150,
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                removeClippedSubviews
                ref={emojiSectionListRef}
              />
            )
          ) : (
            <ActivityIndicatorThemed />
          )}
        </Box>
        <SwitchPanel changeTab={changeTab} displayStickers={displayStickers} />
      </Box>
    )
  },
)

export default EmojiPicker
