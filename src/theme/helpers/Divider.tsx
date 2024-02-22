import { View } from 'react-native'
import { useTheme } from 'react-native-paper'

import { Box, BoxProps } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'

export const Divider = ({ ...boxProps }: BoxProps) => {
  const { colors } = useAppTheme()
  // @ts-ignore
  return <Box height={1} flex backgroundColor={colors.dividerColor} {...boxProps} />
}

export const PaperDivider = ({ ...boxProps }: BoxProps) => {
  const { colors } = useTheme() as App.Theme
  // @ts-ignore
  return <Box height={1} flex backgroundColor={colors.dividerColor} {...boxProps} />
}

export const AlertHorizontalDivider = () => {
  const { colors } = useAppTheme()

  return <View style={{ height: 1, backgroundColor: colors.dividerColor, marginHorizontal: 8 }} />
}

export const AlertVerticalDivider = () => {
  const { colors } = useAppTheme()

  return <View style={{ width: 1, height: '100%', backgroundColor: colors.dividerColor, marginVertical: 4 }} />
}
