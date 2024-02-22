import React from 'react'
import { ActivityIndicator } from 'react-native'

import { Box } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'

export const ActivityIndicatorThemed = () => {
  const { colors } = useAppTheme()
  return (
    <Box flex alignItems="center" justifyContent="center">
      <ActivityIndicator size="large" color={colors.iconHLcolor} />
    </Box>
  )
}
