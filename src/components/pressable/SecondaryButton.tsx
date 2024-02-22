import { Icons } from '@assets'
import { ViewStyle } from 'react-native'

import { AvailableIcons } from '@src/mytypes'
import { Box, BoxProps } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'

interface ISecondaryButton {
  text: string
  onPress: () => void
  disabled?: boolean
  style?: ViewStyle
  leftIconName?: AvailableIcons
}

export const SecondaryButton = ({
  text,
  onPress,
  disabled,
  style,
  leftIconName,
  ...boxProps
}: ISecondaryButton & BoxProps) => {
  const { colors } = useAppTheme()

  const Icon = leftIconName ? Icons.svg[leftIconName] : null

  return (
    <Box
      backgroundColor={colors[disabled ? 'disabledButtonColor' : 'secondaryButtonColor']}
      {...boxProps}
      borderWidth={disabled ? 0 : 1}
      borderColor={colors.buttonColor}
      pt={12}
      pb={12}
      pl={0}
      pr={0}
      onPress={onPress}
      effect="ripple"
      justifyContent="center"
      rippleColor={colors.secondaryButtonHighlight}
      borderRadius={8}
      style={style}
      disabled={disabled}
      row
    >
      <>
        {Icon ? (
          <Box mr={9}>
            <Icon width={24} height={24} fill={disabled ? colors.defaultInputTextColor : colors.iconHLcolor} />
          </Box>
        ) : null}
        <Text
          numberOfLines={1}
          colorName={disabled ? 'defaultInputTextColor' : 'buttonColor'}
          weight="medium"
          type="body"
        >
          {text}
        </Text>
      </>
    </Box>
  )
}
