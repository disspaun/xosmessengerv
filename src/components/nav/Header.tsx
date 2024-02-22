import { ReactNode } from 'react'
import { StyleSheet } from 'react-native'

import { Box, BoxProps } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'
import { useStyles } from '@src/theme/useStyles'

interface IHeader {
  title?: string
  right?: ReactNode
  left?: ReactNode
  center?: ReactNode
  shadow?: boolean
  backgroundColor?: string
}

const getStyles = (theme: App.Theme) => {
  const styles = StyleSheet.create({
    title: {
      textAlign: 'center',
      alignSelf: 'center',
      marginTop: 12,
      marginBottom: 12,
    },
    shadow: {
      shadowColor: theme.colors.backdrop,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5,
    },
  })
  return styles
}

export const Header = ({ title, right, left, center, shadow, backgroundColor, ...boxProps }: IHeader & BoxProps) => {
  const { insets, colors } = useAppTheme()
  const styles = useStyles(getStyles)
  return (
    <Box
      {...boxProps}
      style={shadow && styles.shadow}
      backgroundColor={backgroundColor || colors.mainBackground}
      pt={insets.top}
      row
    >
      {left ? left : <Box flex />}
      {center ? (
        center
      ) : title ? (
        <Text type="body" weight="medium" numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      ) : (
        <Box flex />
      )}
      {right ? right : <Box flex />}
    </Box>
  )
}
