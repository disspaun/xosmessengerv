import { Icons } from '@assets'
import { memo, useCallback } from 'react'

import { getFieldStyles } from '@src/components/fields/OptionsPickerWithIcon'

import { AvailableIcons } from '@src/mytypes'
import { Box, BoxProps } from '@src/theme/helpers/Box'
import { Gap } from '@src/theme/helpers/Gap'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'
import { useStyles } from '@src/theme/useStyles'

interface ILabeledFieldWithAction extends Partial<BoxProps> {
  value: string
  action: (value: string) => void
  label: string
  leftIconName?: AvailableIcons
  rightIconName?: AvailableIcons
}

export const LabeledFieldWithAction = memo(
  ({ value, label, action, leftIconName, rightIconName, ...boxProps }: ILabeledFieldWithAction) => {
    const styles = useStyles(getFieldStyles, !!value)
    const { colors } = useAppTheme()

    const Icon = leftIconName ? Icons.svg[leftIconName] : null
    const RightIcon = rightIconName ? Icons.svg[rightIconName] : null

    const onPress = useCallback(() => {
      action(value)
    }, [value, action])

    return (
      <Box pt={4} pb={8} {...boxProps} effect="ripple" rippleColor={colors.tapHLColor} onPress={onPress}>
        <>
          <Text colorName="secondaryText" type="semiSecondary">
            {label}
          </Text>
          <Box mt={4} row borderColor={styles.inputStrokeColor.color}>
            {Icon ? <Icon width={24} height={24} fill={styles.accentColor.color} /> : null}
            <Gap x={8} />
            <Text numberOfLines={1} flex type="body" style={styles.input}>
              {value}
            </Text>
            <Gap x={8} />
            <Box>{RightIcon ? <RightIcon width={24} height={24} fill={styles.accentColor.color} /> : null}</Box>
          </Box>
        </>
      </Box>
    )
  },
)
