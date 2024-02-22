import { Icons } from '@assets'
import { useNavigation } from '@react-navigation/native'
import { memo, useCallback, useEffect, useLayoutEffect, useState } from 'react'

import { UserStatus } from '@src/components/elements/UserStatus'
import { UnreadCount } from '@src/components/elements/badges/UnreadCount'
import { ParsedText } from '@src/components/elements/text/ParsedText'
import { Swipeable } from '@src/components/layout/Swipeable'

import { DocumentRepository, MessageRepository } from '@src/database/repositories'
import { Chat, Document, Message } from '@src/draft/types'
import { useLocalization } from '@src/locales/localization'
import { Box } from '@src/theme/helpers/Box'
import { Gap } from '@src/theme/helpers/Gap'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'
import { createAtFormatChatShort } from '@src/utils/time'

export interface IChatItem {
  item: Chat
}

export const DeleteAction = () => {
  const { colors } = useAppTheme()
  const { t } = useLocalization()

  return (
    <Box alignItems="center" row>
      <Icons.svg.trash fill={colors.white} width={24} height={24} />
      <Gap x={12} />
      <Text type="secondary" weight="medium" colorName="white">
        {t('delete')}
      </Text>
    </Box>
  )
}

export const MuteAction = () => {
  const { colors } = useAppTheme()
  const { t } = useLocalization()

  return (
    <Box alignItems="center" row>
      <Icons.svg.disableNotification fill={colors.white} width={24} height={24} />
      <Gap x={12} />
      <Text type="secondary" weight="medium" colorName="white">
        {t('mute')}
      </Text>
    </Box>
  )
}

export const ChatItem = memo(({ item }: IChatItem) => {
  const { colors } = useAppTheme()
  const [document, setDocument] = useState<Document | null>(null)
  const [lastMessage, setLastMessage] = useState<Message | null>(null)
  const navigation = useNavigation()
  const openChat = useCallback(() => {
    navigation.navigate('chat', { chat: item })
  }, [item.id, navigation])

  const loadDocument = useCallback(async () => {
    const asset = await DocumentRepository.findOne({ where: { id: lastMessage?.documents?.[0] } })
    setDocument(asset)
  }, [lastMessage?.documents])

  useLayoutEffect(() => {
    if (!lastMessage?.documents) {
      return
    }
    void loadDocument()
  }, [lastMessage?.documents])

  const updateLastMessage = useCallback(async () => {
    try {
      setDocument(null)
      const message = await MessageRepository.findOne({ where: { id: item.lastMessageId } })
      setLastMessage(message)
    } catch (e) {
      alert(JSON.stringify(e))
    }
  }, [item.lastMessageId])

  useEffect(() => {
    void updateLastMessage()
  }, [item.lastMessageId])

  const fileName = document?.name ? 'File: ' + document.name : null

  return (
    <Swipeable left={<MuteAction />} right={<DeleteAction />} onRight={() => {}} onLeft={() => {}}>
      <Box row p={16} effect="ripple" rippleColor={colors.tapHLColor} onPress={openChat}>
        <>
          <Box mr={16}>
            <UserStatus backgroundColor={colors.background} chat={item} size={{ statusBadge: 12, avatar: 48 }} />
          </Box>
          <Box flex>
            <Box flex row justifyContent="space-between" alignItems={'flex-end'}>
              <Text weight="medium">{item.name}</Text>
              {lastMessage?.timestamp ? (
                <Text colorName="secondaryText" type="secondary">
                  {createAtFormatChatShort(Number(lastMessage?.timestamp))}
                </Text>
              ) : null}
            </Box>
            <Gap y={7} />
            <Box flex row justifyContent="space-between" alignItems="center">
              <Box row overflow="hidden" flex>
                <ParsedText
                  lineHeight={20}
                  enlargeSingleSmile={false}
                  numberOfLines={1}
                  text={fileName || lastMessage?.body || lastMessage?.sticker || ''}
                  colorName="secondaryText"
                  flex
                  type="secondary"
                />
              </Box>
              {Number(item.count) ? <UnreadCount count={item.count} /> : null}
            </Box>
          </Box>
        </>
      </Box>
    </Swipeable>
  )
})
