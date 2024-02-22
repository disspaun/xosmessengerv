import { StatusUser } from '../../tm/Types'
import { Icons } from '@assets'
import { ViewToken } from '@react-native/virtualized-lists/Lists/VirtualizedList'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Dispatch, RefObject, SetStateAction, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Platform, SectionList, StatusBar } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { NativeScrollEvent } from 'react-native/Libraries/Components/ScrollView/ScrollView'
import { NativeSyntheticEvent } from 'react-native/Libraries/Types/CoreEventTypes'

import { AnchorMenu } from '@src/components/controls/AnchorMenu'
import { MessageInput, MessageInputState } from '@src/components/controls/MessageInput'
import { MessageRow } from '@src/components/elements/Messages'
import { UserStatus } from '@src/components/elements/UserStatus'
import { EmptyResults } from '@src/components/elements/chatBody/EmptyResults'
import { ChatDateSection } from '@src/components/elements/indices/ChatDateSection'
import { Header } from '@src/components/nav/Header'
import { TapePressable } from '@src/components/pressable/TapePressable'

import { getChatSections } from '@src/draft/helpers/chat'
import { clearUpShadowOnes } from '@src/draft/reducers/chatReducer'
import { Message } from '@src/draft/types'
import { useAppStateChangeWithCallbacks } from '@src/hooks/useAppStateChangeWithCallbacks'
import {
  clearChatUnreadCount,
  clearSpamMessageProccesing,
  messagesDispatchRef,
  spamSomething,
  useChat,
} from '@src/hooks/useChat'
import { useLocalization } from '@src/locales/localization'
import { AvailableColors } from '@src/mytypes'
import { useSystemOpenedSetChatScrollOffset } from '@src/providers/SystemProvider'
import { AllStackParamList, ScreenProps } from '@src/routing/NavigationTypes'
import { basicStyles } from '@src/theme/basicStyles'
import { Box, BoxProps } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'

export const LeftBack = ({
  navigation,
  iconColor,
  onBack,
  alignSelf,
}: {
  iconColor: AvailableColors
  navigation?: NativeStackNavigationProp<AllStackParamList>
  onBack?: () => void
  alignSelf?: BoxProps['alignSelf']
}) => {
  const { colors } = useAppTheme()
  const goBack = useCallback(() => {
    onBack ? onBack() : navigation?.goBack?.()
  }, [navigation, onBack])
  return (
    <TapePressable rippleColor={iconColor} alignSelf={alignSelf} mr={16} ml={16} pl={4} pr={4} onPress={goBack}>
      <Icons.svg.back width={24} height={24} fill={iconColor || colors.iconColor} />
    </TapePressable>
  )
}

const HamburgerMenu = memo(() => {
  const { colors, insets } = useAppTheme()

  const topOffset = useMemo(
    () => Platform.select({ ios: insets.top + 8, default: (StatusBar.currentHeight || 0) + 8 }),
    [insets.top],
  )

  return (
    <AnchorMenu
      mt={6}
      mr={16}
      ml={16}
      pl={4}
      pr={4}
      extraOffset={{ top: topOffset, left: 8 }}
      style={{ backgroundColor: colors.menuBackgroundColor }}
      menuRows={[
        { key: '1', leftIconName: 'search', label: 'search' },
        { key: '2', leftIconName: 'disableNotification', label: 'disableNotifications' },
        { key: '3', leftIconName: 'copy', label: 'copyPublicKey' },
        { key: '4', leftIconName: 'share', label: 'sharePublicKey' },
        { key: '5', leftIconName: 'viewProfile', label: 'viewProfile' },
        { key: '6', leftIconName: 'pencil', label: 'renameContacts' },
        { key: '7', leftIconName: 'deleteHistory', label: 'clearHistory' },
        'divider7to8',
        { key: '8', leftIconName: 'banUser', label: 'blockContact' },
        { key: '9', leftIconName: 'trash', label: 'deleteContact' },
        'divider9to10',
        {
          key: '10',
          leftIconName: 'banUser',
          label: '_stopSpam',
          onPress: clearUpSpamInterval,
        },
      ]}
      iconColor="iconColor"
      iconName="menu"
    />
  )
})

const Center = ({ navigation, chat }) => {
  const { t } = useLocalization()
  const { colors } = useAppTheme()
  return (
    <Box row flex>
      <Box mr={12} alignSelf="center">
        <UserStatus backgroundColor={colors.mainBackground} chat={chat} size={{ statusBadge: 8, avatar: 32 }} />
      </Box>
      <Box>
        <Box mt={4}>
          <Text weight="medium" lineHeight={21}>
            {chat.name}
          </Text>
        </Box>
        <Box mb={4}>
          <Text colorName="secondaryText" type="semiSecondary">
            {t(StatusUser[chat.status])}
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export let spamInterval = null

const clearUpSpamInterval = () => {
  clearInterval(spamInterval)
  spamInterval = null
}

export let sectionListRef: RefObject<SectionList> = { current: null }
export let sectionListScrollOffsetRef = 0
export let chatBodySetVisibilityRef: Dispatch<SetStateAction<boolean>> | null
export let chatBodyVisibilityRef = false
export let chatBodyOpenWithRef = ''

export const getSectionListScrollOffsetRef = () => {
  return sectionListScrollOffsetRef
}

let isChatListScrollViewMoving = false

export const isChatListEndNotViewing = (_with: string) => {
  if (chatBodyOpenWithRef !== _with) {
    return true
  }
  const _currentState = sectionListRef.current?.getScrollResponder()?._isAnimating() || sectionListScrollOffsetRef
  if (_currentState) {
    isChatListScrollViewMoving = _currentState
  } else {
    setTimeout(() => {
      isChatListScrollViewMoving = _currentState
    }, 500)
  }
  return isChatListScrollViewMoving
}

export const setChatBodyVisibility = (value: SetStateAction<boolean>) => {
  chatBodySetVisibilityRef?.(value)
}

export const isChatBodyVisible = () => {
  return chatBodyVisibilityRef
}

const maintainVisibleContentPosition = { minIndexForVisible: 0, autoscrollToTopThreshold: 0 }
const viewabilityConfig = {
  waitForInteraction: false,
  itemVisiblePercentThreshold: 40,
  minimumViewTime: 200,
}
const overrideProps = { isInvertedVirtualizedList: true }

export const ChatScreen = ({ navigation, route }: ScreenProps<'chat'>) => {
  const { t } = useLocalization()
  const messageInput = useRef<MessageInput>(null)
  const sectionList = useRef<SectionList>(null)
  const setChatScrollOffsetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isChatBodyVisible, setIsChatBodyVisible] = useState(true)
  const [currentDate, setCurrentDate] = useState('')
  const currentDateRef = useRef('')

  chatBodyVisibilityRef = isChatBodyVisible

  const chat = route.params.chat

  const startSpamming = useCallback(() => {
    spamInterval = setInterval(() => spamSomething(chat), 1000)
  }, [])

  useEffect(() => {
    if (chat.from !== 'Spambot1') {
      return
    }
    clearUpSpamInterval()
    clearSpamMessageProccesing()
    startSpamming()
  }, [])

  useAppStateChangeWithCallbacks(clearUpSpamInterval, startSpamming)

  const setChatScrollOffset = useSystemOpenedSetChatScrollOffset()

  useEffect(() => {
    chatBodySetVisibilityRef = setIsChatBodyVisible
    sectionListRef = sectionList
    const currentUser = chat.from
    chatBodyOpenWithRef = currentUser
    return () => {
      setChatScrollOffsetTimeout.current && clearTimeout(setChatScrollOffsetTimeout.current)
      setChatScrollOffset(0)
      sectionListRef = { current: null }
      chatBodySetVisibilityRef = null
      isChatListScrollViewMoving = false
      chatBodyVisibilityRef = false
      sectionListScrollOffsetRef = 0
      chatBodyOpenWithRef = ''
      clearUpShadowOnes(currentUser)
    }
  }, [])

  const { messages, sendMessage, setLastId, total } = useChat(chat.from)

  const { colors, dark } = useAppTheme()
  const sections = getChatSections(messages, { today: t('today'), yesterday: t('yesterday') })

  const renderSectionFooter = useCallback(({ section: { title } }) => {
    const isHidden = currentDateRef.current === title
    return <ChatDateSection isHidden={isHidden} title={title} m={8} mr={0} ml={0} />
  }, [])

  const renderItem = useCallback(({ item }: { item: Message }) => <MessageRow item={item} />, [])

  const setChatScrollOffsetWithTimeout = useCallback((contentOffset: number) => {
    setChatScrollOffsetTimeout.current && clearTimeout(setChatScrollOffsetTimeout.current)
    setChatScrollOffsetTimeout.current = setTimeout(() => {
      setChatScrollOffset(contentOffset)
    }, 250)
  }, [])

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const contentOffset = event.nativeEvent.contentOffset.y
      if (contentOffset === 0 && sectionListScrollOffsetRef !== 0) {
        // dis one is temporary solution
        messagesDispatchRef?.({ type: 'ADD_MESSAGE', with: chat.from, forceUpdate: true })
        void clearChatUnreadCount(chat.from)
      }
      sectionListScrollOffsetRef = contentOffset
      setChatScrollOffsetWithTimeout(contentOffset)
    },
    [chat.from],
  )

  const onEndReached = useCallback(() => {
    console.log('total: ', total)
    if (total > 0) {
      setLastId(messages[messages.length - 1].id)
    }
  }, [total, setLastId])

  const onScrollBeginDrag = useCallback(() => {
    messageInput.current?.setInputState(MessageInputState.Closed)
    messageInput.current?.textInput?.blur()
  }, [])

  const backgroundColor = useMemo(() => ({ backgroundColor: colors.backgroundColor }), [colors.backgroundColor])

  const keyExtractor = useCallback((item: Message) => `${item.id}`, [])

  const updateCurrentDate = useCallback(
    ({ viewableItems, changed }: { viewableItems: Array<ViewToken>; changed: Array<ViewToken> }) => {
      if (viewableItems && viewableItems.length) {
        const lastItem = viewableItems.pop()
        if (lastItem && lastItem.section) {
          const newCurrentDate = lastItem.section.title
          setCurrentDate(newCurrentDate)
          currentDateRef.current = newCurrentDate
        }
      }
    },
    [],
  )

  return (
    <GestureHandlerRootView style={[basicStyles.flex, backgroundColor]}>
      <Header
        right={<HamburgerMenu />}
        center={<Center navigation={navigation} chat={chat} />}
        left={
          <Box justifyContent="center">
            <LeftBack alignSelf="flex-start" navigation={navigation} />
          </Box>
        }
        shadow
      />
      {currentDate && !messageInput.current?.isFileMode ? (
        <ChatDateSection
          title={currentDate}
          backgroundColor={colors.mainBackground + 85}
          absolute
          top={42}
          pt={4}
          pb={4}
          zIndex={2}
          dividerLineMargin={16}
        />
      ) : null}
      <SectionList
        maintainVisibleContentPosition={maintainVisibleContentPosition}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="never"
        indicatorStyle={dark ? 'white' : 'black'}
        ref={sectionList}
        // initialScrollIndex={3}
        // onScrollToIndexFailed={() => {
        //   alert(1)
        // }}
        onScroll={onScroll}
        ListEmptyComponent={
          <EmptyResults>
            <Text type="secondary" colorName="secondaryText">
              {t('emptyChat')}
            </Text>
          </EmptyResults>
        }
        renderSectionFooter={renderSectionFooter}
        contentContainerStyle={[basicStyles.screenHorizontal, basicStyles.flexGrow]}
        renderItem={renderItem}
        removeClippedSubviews
        windowSize={6}
        initialNumToRender={6}
        viewabilityConfig={viewabilityConfig}
        maxToRenderPerBatch={9}
        scrollEventThrottle={250}
        onViewableItemsChanged={updateCurrentDate}
        updateCellsBatchingPeriod={100}
        onEndReached={onEndReached}
        onEndReachedThreshold={3}
        keyExtractor={keyExtractor}
        style={[basicStyles.flex, !isChatBodyVisible && { display: 'none' }]}
        sections={sections}
        overrideProps={overrideProps}
        inverted
        // invertStickyHeaders
        // stickySectionHeadersEnabled
        onScrollBeginDrag={onScrollBeginDrag}
      />
      <MessageInput ref={messageInput} sendMessage={sendMessage} from={chat.from} />
    </GestureHandlerRootView>
  )
}
