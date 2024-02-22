import { StatusUser } from '../../../../tm/Types'
import { memo } from 'react'
import { StyleSheet } from 'react-native'

import { Box, BoxProps } from '@src/theme/helpers/Box'
import { useStyles } from '@src/theme/useStyles'

export function getStatusColor(status: StatusUser, theme: App.Theme) {
  let statusColor

  switch (status) {
    case StatusUser.Available:
      statusColor = theme.colors.statusOnlineColor
      break
    case StatusUser.DoNotDisturb:
      statusColor = theme.colors.statusDNDColor
      break

    case StatusUser.Away:
      statusColor = theme.colors.statusAwayColor
      break

    case StatusUser.Offline:
      statusColor = theme.colors.statusOfflineColor
      break

    case StatusUser.Invisible:
      statusColor = theme.colors.statusInvisibleColor
      break

    case StatusUser.NotAvailable:
      statusColor = theme.colors.statusUnauthorizedColor
      break

    default:
      statusColor = theme.colors.statusUnauthorizedColor
      break
  }

  return statusColor
}

const getStyles = (theme: App.Theme, status: StatusUser, size: number) => {
  const styles = StyleSheet.create({
    status: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: getStatusColor(status, theme),
      ...(status === StatusUser.Offline && { borderWidth: 1, borderColor: theme.colors.statusInvisibleColor }),
    },
  })
  return styles
}

export const OnlineStatus = memo(({ status, size, ...boxProps }: { status: StatusUser; size: number } & BoxProps) => {
  const styles = useStyles(getStyles, status, size)
  return <Box style={styles.status} {...boxProps} />
})
