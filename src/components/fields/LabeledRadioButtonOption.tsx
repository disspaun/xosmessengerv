import { memo, useEffect, useState } from 'react'

import { CheckBox } from '@src/components/fields/CheckBox'

import { useEffectExceptOnMount } from '@src/hooks/common/useRenderedOnce'
import { Box } from '@src/theme/helpers/Box'
import { Gap } from '@src/theme/helpers/Gap'
import { Text } from '@src/theme/themed'

interface ILabeledRadioButtonOption {
  label: string
  description: string
  onChange: (value: string) => void
  value: string
  checked?: string
}

export const LabeledRadioButtonOption = memo(
  ({ label, description, checked, onChange, value }: ILabeledRadioButtonOption) => {
    const [_isChecked, _setIsChecked] = useState(checked === value)

    useEffect(() => {
      _isChecked && onChange(value)
    }, [_isChecked])

    useEffectExceptOnMount(() => {
      _setIsChecked(checked === value)
    }, [checked])

    return (
      <Box row justifyContent="space-between">
        <Box>
          <Text numberOfLines={1} type="body">
            {label}
          </Text>
          <Gap y={4} />
          <Text numberOfLines={1} colorName="secondaryText" type="semiSecondary">
            {description}
          </Text>
        </Box>
        <Box alignSelf="center">
          <CheckBox onCheck={_setIsChecked} icon="radioButton" value={_isChecked} />
        </Box>
      </Box>
    )
  },
)
