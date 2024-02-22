import { memo } from 'react'

import { Box, BoxProps } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'

export const UnreadCount = memo(({ count, ...boxProps }: { count?: number } & BoxProps) => {
  const { colors } = useAppTheme()
  if (!count) {
    return null
  }
  return (
    <Box borderRadius={4} alignSelf="center" pl={8} pr={8} backgroundColor={colors.buttonColor} {...boxProps}>
      <Text numberOfLines={1} ellipsizeMode="clip" colorName="white" weight="medium" type="secondary" lineHeight={20}>
        {count}
      </Text>
    </Box>
  )
})
