import { ViewStyle } from 'react-native'

import { AvailableColors } from '@src/mytypes'
import { Box, BoxProps } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'

interface IMainButton {
  text: string
  onPress: () => void
  disabled?: boolean
  style?: ViewStyle
  buttonColor?: AvailableColors
  rippleColor?: AvailableColors
}

export const MainButton = ({
  text,
  onPress,
  disabled,
  style,
  buttonColor,
  rippleColor,
  ...boxProps
}: IMainButton & BoxProps) => {
  const { colors } = useAppTheme()

  return (
    <Box
      backgroundColor={buttonColor || colors[disabled ? 'disabledButtonColor' : 'buttonColor']}
      {...boxProps}
      pt={12}
      pb={12}
      onPress={onPress}
      effect="ripple"
      rippleColor={rippleColor || colors.buttonHLColor}
      alignItems="center"
      borderRadius={8}
      style={style}
      disabled={disabled}
    >
      <Text
        numberOfLines={1}
        colorName={disabled ? 'defaultInputTextColor' : 'buttonTextColor'}
        weight="medium"
        type="body"
        lineHeight={22}
      >
        {text}
      </Text>
    </Box>
  )
}
