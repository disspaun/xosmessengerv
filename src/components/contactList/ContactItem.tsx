import { useNavigation } from '@react-navigation/native'
import { memo, useCallback } from 'react'

import { DeleteAction, MuteAction } from '@src/components/chatList/ChatItem'
import { UserStatus } from '@src/components/elements/UserStatus'
import { OnlineStatus } from '@src/components/elements/indicators/OnlineStatus'
import { Swipeable } from '@src/components/layout/Swipeable'

import { Chat } from '@src/draft/types'
import { Box } from '@src/theme/helpers/Box'
import { Gap } from '@src/theme/helpers/Gap'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'

export interface IContactItem {
  item: Chat
}

export const ContactItem = memo(({ item }: IContactItem) => {
  const { colors } = useAppTheme()
  const navigation = useNavigation()
  const openChat = useCallback(() => {
    navigation.navigate('chat', { chat: item })
  }, [item.id, navigation])

  return (
    <Swipeable left={<MuteAction />} right={<DeleteAction />} onRight={() => {}} onLeft={() => {}}>
      <Box row p={16} effect="ripple" rippleColor={colors.tapHLColor} onPress={openChat}>
        <>
          <Box mr={16}>
            <UserStatus chat={item} size={{ statusBadge: 12, avatar: 48 }} />
          </Box>
          <Box flex>
            <Box flex row justifyContent="space-between">
              <Text weight="medium">{item.name}</Text>
            </Box>
            <Gap y={8} />
            <Box flex row justifyContent="space-between" alignItems="center">
              <OnlineStatus status={item.status} size={12} mr={6} />
              <Text colorName="secondaryText" flex type="secondary">
                Online
              </Text>
            </Box>
          </Box>
        </>
      </Box>
    </Swipeable>
  )
})
