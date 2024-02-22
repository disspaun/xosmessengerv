import { StatusUser } from '../../../../tm/Types'
import { StyleSheet } from 'react-native'

import { getStatusColor } from '@src/components/elements/indicators/OnlineStatus'

import { Box } from '@src/theme/helpers/Box'
import { useStyles } from '@src/theme/useStyles'

const getStyles = (theme: App.Theme, status: StatusUser, size: number, backgroundColor: string) => {
  const styles = StyleSheet.create({
    status: {
      width: size + 2,
      height: size + 2,
      borderRadius: size / 2 + 1,
      bottom: -4,
      right: -4,
      borderWidth: 2,
      backgroundColor: getStatusColor(status, theme),
      borderColor: backgroundColor,
    },
  })
  return styles
}

export const RecentActivityAvatarBadgeStatus = ({
  status,
  size,
  backgroundColor,
}: {
  status: StatusUser
  size: number
  backgroundColor: string
}) => {
  const styles = useStyles(getStyles, status, size, backgroundColor)
  return <Box absolute style={styles.status} />
}
