import { Icons } from '@assets'
import { ReactNode, memo } from 'react'

import { AvailableIcons } from '@src/mytypes'
import { Box, BoxProps } from '@src/theme/helpers/Box'
import { Gap } from '@src/theme/helpers/Gap'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'

interface IExternalOptionPickerWithIcon extends Partial<BoxProps> {
  text: string
  onPress: () => void
  leftIconName?: AvailableIcons
  children?: ReactNode
}

export const ExternalOptionPickerWithIcon = memo(
  ({ text, onPress, leftIconName, children, ...boxProps }: IExternalOptionPickerWithIcon) => {
    const { colors } = useAppTheme()

    const Icon = leftIconName ? Icons.svg[leftIconName] : null

    return (
      <Box pt={16} pb={16} row {...boxProps} effect="ripple" rippleColor={colors.tapHLColor} onPress={onPress}>
        <>
          {Icon ? <Icon width={24} height={24} fill={colors.iconColor} /> : null}
          <Gap x={8} />
          <Text numberOfLines={1} flex type="body">
            {text}
          </Text>
          <Gap x={8} />
          {children}
          <Gap x={8} />
          <Box>
            <Icons.svg.arrowRight width={24} height={24} fill={colors.iconColor} />
          </Box>
        </>
      </Box>
    )
  },
)
