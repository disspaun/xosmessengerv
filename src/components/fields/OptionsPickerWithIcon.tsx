import { Icons } from '@assets'
import { memo } from 'react'
import { StyleSheet, View } from 'react-native'

import { AvailableIcons } from '@src/mytypes'
import { Box } from '@src/theme/helpers/Box'
import { Gap } from '@src/theme/helpers/Gap'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'
import { useStyles } from '@src/theme/useStyles'

interface IOptionsPickerWithIcon extends Partial<View> {
  placeholder: string
  onPress: () => void
  leftIconName?: AvailableIcons
  textValue?: string
  visible?: boolean
  error?: string
}

export const getFieldStyles = (theme: App.Theme, isFocused: boolean) => {
  const mainColor = isFocused ? theme.colors.iconColor : theme.colors.defaultInputIconColor
  const textColor = isFocused ? theme.colors.selectedInputTextColor : theme.colors.defaultInputTextColor
  const strokeColor = isFocused ? theme.colors.selectedInputStrokeColor : theme.colors.inputStrokeDefault

  const styles = StyleSheet.create({
    input: {
      color: textColor,
      flex: 1,
      alignSelf: 'center',
    },
    accentColor: {
      color: mainColor,
    },
    inputStrokeColor: {
      color: strokeColor,
    },
  })
  return styles
}

export const OptionsPickerWithIcon = memo(
  ({ placeholder, leftIconName, onPress, error, visible, textValue, ...viewProps }: IOptionsPickerWithIcon) => {
    const styles = useStyles(getFieldStyles, visible || !!textValue)
    const { colors } = useAppTheme()

    const Icon = leftIconName ? Icons.svg[leftIconName] : null

    return (
      <Box
        row
        p={12}
        borderWidth={1}
        borderRadius={8}
        borderColor={error ? colors.errorTextColor : styles.inputStrokeColor.color}
        backgroundColor={colors.inputBackgroundColor}
        {...viewProps}
        effect="none"
        onPress={onPress}
      >
        {Icon ? <Icon width={24} height={24} fill={styles.accentColor.color} /> : null}
        <Gap x={8} />
        <Text type="body" style={styles.input}>
          {textValue || placeholder}
        </Text>
        <Gap x={8} />
        <Box effect="none" onPress={onPress}>
          <Icons.svg.arrowDown width={24} height={24} fill={styles.accentColor.color} />
        </Box>
      </Box>
    )
  },
)
