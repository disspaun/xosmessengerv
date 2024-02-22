import { Icons } from '@assets'
import { memo, useCallback } from 'react'
import { StyleSheet } from 'react-native'

import { UnreadCount } from '@src/components/elements/badges/UnreadCount'

import { useChatProvider } from '@src/providers/ChatProvider'
import { useSystemOpenedChatScrollOffset } from '@src/providers/SystemProvider'
import { sectionListRef } from '@src/screens/ChatScreen'
import { Box } from '@src/theme/helpers/Box'
import { TranslateYOffset } from '@src/theme/helpers/FakeView'
import { useAppTheme } from '@src/theme/theme'
import { useStyles } from '@src/theme/useStyles'
import { isIOS } from '@src/utils/isIOS'

interface IChatUnreadArrow {
  from: string
  display: boolean
}

const getStyles = (theme: App.Theme) => {
  const styles = StyleSheet.create({
    container: {
      shadowColor: isIOS ? theme.colors.backdrop : '',
      shadowOffset: { width: 0, height: -0.4 },
      shadowOpacity: 0.5,
      borderTopWidth: 0,

      elevation: 4,
    },
  })
  return styles
}

export const ChatUnreadArrow = memo(({ from, display }: IChatUnreadArrow) => {
  const { colors } = useAppTheme()
  const styles = useStyles(getStyles)

  const { chats } = useChatProvider()
  const chatScrollOffset = useSystemOpenedChatScrollOffset()

  const scrollToStart = useCallback(() => {
    sectionListRef.current?.getScrollResponder()?.scrollTo(0)
  }, [])

  const unreadCount = chats.find((chat) => chat.from === from)?.count || 0

  if (!display) {
    return null
  }

  return chatScrollOffset > 75 ? (
    <TranslateYOffset additionalOffset={100}>
      <Box
        absolute
        right={16}
        h={36}
        w={36}
        borderRadius={18}
        backgroundColor={colors.menuBackgroundColor}
        justifyContent="center"
        alignItems="center"
        onPress={scrollToStart}
        style={styles.container}
      >
        <Icons.svg.arrowDown width={24} height={24} fill={colors.iconColor} />
        {Number(unreadCount) ? <UnreadCount bottom={24} absolute count={Math.min(unreadCount, 99)} /> : null}
      </Box>
    </TranslateYOffset>
  ) : null
})
