import { useNavigation } from '@react-navigation/native'
import { memo, useCallback } from 'react'
import { Image } from 'react-native'

import { UserStatus } from '@src/components/elements/UserStatus'

import { DocumentRepository } from '@src/database/repositories'
import { Chat } from '@src/draft/types'
import { sendMessage } from '@src/hooks/useChat'
import { Box } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'

export interface IRoundChatItem {
  item: Chat
  uri: string
  mimeType: string
  text: string
  fileName?: string
}

const composeMessageWithShareHandledDocument = async ({
  uri,
  mimeType,
  text,
  item,
  width,
  height,
  fileName,
}: {
  uri: string
  mimeType: string
  text: string
  item: Chat
  width?: number
  height?: number
  fileName?: string
}) => {
  const newDocument = DocumentRepository.create({
    name: fileName,
    path: uri,
    mimeType,
    width,
    height,
  })
  const newDocumentRes = await newDocument.save()
  if (newDocumentRes?.id) {
    sendMessage({ message: text, documents: [newDocumentRes?.id], from: item.from, animate: true }).catch(() => {})
  }
}

export const RoundChatItem = memo(({ item, uri, mimeType, text, fileName }: IRoundChatItem) => {
  const { colors } = useAppTheme()
  const navigation = useNavigation()
  const proceedShare = useCallback(async () => {
    try {
      if (mimeType.includes('image')) {
        Image.getSize(
          uri,
          async (_width, _height) => {
            await composeMessageWithShareHandledDocument({
              uri,
              mimeType,
              fileName,
              width: _width,
              height: _height,
              item,
              text,
            })
          },
          console.error,
        )
      } else {
        await composeMessageWithShareHandledDocument({ uri, mimeType, fileName, item, text })
      }
    } catch (e) {
      alert(JSON.stringify(e))
    }
    navigation.goBack()
  }, [item.id, navigation])

  return (
    <Box p={16} effect="none" onPress={proceedShare} alignItems="center" justifyContent="center">
      <Box w={48} mb={8}>
        <UserStatus backgroundColor={colors.backgroundColor} chat={item} size={{ statusBadge: 10, avatar: 48 }} />
      </Box>
      <Text weight="medium">{item.name}</Text>
    </Box>
  )
})
