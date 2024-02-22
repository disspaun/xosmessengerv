import { Icons } from '@assets'
import { useMemo } from 'react'
import { Image } from 'react-native'

import { RecentActivityAvatarBadgeStatus } from '@src/components/elements/indicators/RecentActivityAvatarBadgeStatus'

import { Chat } from '@src/draft/types'
import { Box } from '@src/theme/helpers/Box'

interface IUserStatus {
  chat: Chat
  size: { avatar: number; statusBadge: number }
  backgroundColor?: string
}
export const UserStatus = ({ chat, size, backgroundColor }: IUserStatus) => {
  const avatarSource = useMemo(() => (chat.avatar ? { uri: chat.avatar } : null), [chat.avatar])
  return (
    <>
      {avatarSource ? (
        <Image style={{ width: size.avatar, height: size.avatar, borderRadius: 4 }} source={avatarSource} />
      ) : (
        <Box borderRadius={4} overflow="hidden">
          <Icons.svg.utopiaAvatar style={{ width: size.avatar, height: size.avatar }} />
        </Box>
      )}
      {backgroundColor ? (
        <RecentActivityAvatarBadgeStatus
          backgroundColor={backgroundColor}
          status={chat.status}
          size={size.statusBadge}
        />
      ) : null}
    </>
  )
}
