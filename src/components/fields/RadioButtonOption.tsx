import { memo, useEffect, useState } from 'react'

import { CheckBox } from '@src/components/fields/CheckBox'

import { useEffectExceptOnMount } from '@src/hooks/common/useRenderedOnce'
import { Box } from '@src/theme/helpers/Box'
import { Text } from '@src/theme/themed'

interface IRadioButtonOption {
  label: string
  onChange: (value: string) => void
  value: string
  checked?: string
}

export const RadioButtonOption = memo(({ label, checked, onChange, value }: IRadioButtonOption) => {
  const [_isChecked, _setIsChecked] = useState(checked === value)

  useEffect(() => {
    _isChecked && onChange(value)
  }, [_isChecked])

  useEffectExceptOnMount(() => {
    _setIsChecked(checked === value)
  }, [checked])

  return (
    <Box row justifyContent="flex-start">
      <Box alignSelf="center">
        <CheckBox onCheck={_setIsChecked} icon="radioButton" value={_isChecked} />
      </Box>
      <Box alignSelf="center" ml={12}>
        <Text numberOfLines={1} type="body">
          {label}
        </Text>
      </Box>
    </Box>
  )
})
