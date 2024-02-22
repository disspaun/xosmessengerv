import { Icons } from '@assets'
import { memo } from 'react'
import { ViewStyle } from 'react-native'
import { useTheme } from 'react-native-paper'

import { AvailableColorNames, AvailableIcons } from '@src/mytypes'
import { Box } from '@src/theme/helpers/Box'
import { Gap } from '@src/theme/helpers/Gap'
import { Text } from '@src/theme/themed'

interface IPaperMenuRow {
  text: string
  onPress: () => void
  leftIconName?: AvailableIcons
  backgroundColor?: AvailableColorNames
  contentColor?: AvailableColorNames
  style?: ViewStyle
}

export const PaperMenuRow = memo(
  ({ leftIconName, text, onPress, backgroundColor, contentColor, style }: IPaperMenuRow) => {
    const { colors } = useTheme() as App.Theme
    const Icon = leftIconName ? Icons.svg[leftIconName] : null

    return (
      <Box
        row
        p={12}
        onPress={onPress}
        effect="ripple"
        rippleColor={colors.tapHLColor}
        backgroundColor={backgroundColor ? colors[backgroundColor] : colors.menuBackgroundColor}
        style={style}
      >
        <>
          {Icon ? <Icon width={24} height={24} fill={contentColor ? colors[contentColor] : colors.iconColor} /> : null}
          <Gap x={8} />
          <Box justifyContent="flex-start" alignSelf="center">
            <Text type="body" paperColor={contentColor ? colors[contentColor] : colors.primaryTextColor}>
              {text}
            </Text>
          </Box>

          <Gap x={8} />
        </>
      </Box>
    )
  },
)
