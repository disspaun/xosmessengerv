import { ReactNode } from 'react'
import { ViewStyle } from 'react-native'

import { Box, BoxProps } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'
import { isIOS } from '@src/utils/isIOS'

interface IMainButton extends Partial<BoxProps> {
  onPress: () => void
  style?: ViewStyle
  children?: ReactNode
}
export const TapePressable = ({
  onPress,
  style,
  children,
  ml,
  mr,
  mb,
  mt,
  m,
  alignSelf,
  rippleColor,
  ...boxProps
}: IMainButton) => {
  const { colors } = useAppTheme()
  return (
    <Box borderRadius={4} alignSelf={alignSelf || 'center'} overflow="hidden" m={m} mr={mr} mt={mt} mb={mb} ml={ml}>
      <Box
        p={4}
        pl={8}
        pr={8}
        {...boxProps}
        onPress={onPress}
        alignItems="center"
        style={style}
        activeOpacity={1}
        underlayColor={isIOS ? undefined : colors.bgTextButton}
        rippleColor={rippleColor || colors.bgTextButton}
        effect="ripple"
      >
        {children}
      </Box>
    </Box>
  )
}
