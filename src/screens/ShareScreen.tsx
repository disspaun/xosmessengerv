import { useCallback, useLayoutEffect } from 'react'
import { FlatList } from 'react-native'

import { IChatItem } from '@src/components/chatList/ChatItem'
import { RoundChatItem } from '@src/components/chatList/RoundChatItem'

import { populateChatTemp } from '@src/database/actions/Chat'
import { useLocalization } from '@src/locales/localization'
import { useChatProvider } from '@src/providers/ChatProvider'
import { ScreenProps } from '@src/routing/NavigationTypes'
import { Box } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'

export const ShareScreen = ({ navigation, route }: ScreenProps<'share'>) => {
  useLayoutEffect(() => {
    void populateChatTemp()
  }, [])

  const { uri, mimeType, text, fileName } = route.params
  const { colors } = useAppTheme()
  const { t } = useLocalization()

  const { chats } = useChatProvider()

  const renderItem = useCallback(
    ({ item }: IChatItem) => (
      <RoundChatItem item={item} uri={uri} fileName={fileName} mimeType={mimeType} text={text} />
    ),
    [],
  )

  return (
    <Box flex p={16} backgroundColor={colors.backgroundColor}>
      <Box alignSelf="center">
        <Text weight="medium">{t('sendTo')}</Text>
      </Box>
      <FlatList data={chats} numColumns={4} renderItem={renderItem} />
    </Box>
  )
}
