import { Slider } from '@miblanchard/react-native-slider'
import { memo, useCallback, useState } from 'react'

import { Box } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'

interface ILabeledSliderWithValue {
  onChange: (e: number) => void
  text: string
  postfix: string
  min: number
  max: number
  value: number
}

export const LabeledSliderWithValue = memo(({ onChange, text, postfix, min, max, value }: ILabeledSliderWithValue) => {
  const [_value, _setValue] = useState(value)
  const { colors } = useAppTheme()

  const onValueChange = useCallback(
    (e: number[]) => {
      onChange(e[0])
      _setValue(e[0])
    },
    [onChange],
  )

  return (
    <>
      <Box row justifyContent="space-between">
        <Text type="body">{text}</Text>
        <Text type="body" colorName="secondaryText">{`${_value.toFixed(0)}${postfix}`}</Text>
      </Box>
      <Box mt={12}>
        <Slider
          minimumValue={min}
          maximumValue={max}
          value={_value}
          minimumTrackTintColor={colors.buttonColor}
          maximumTrackTintColor={colors.disableSwitch}
          thumbTintColor={colors.buttonColor}
          onValueChange={onValueChange}
        />
      </Box>
    </>
  )
})
