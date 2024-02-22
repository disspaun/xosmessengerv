import { Icons } from '@assets'
import { memo, useMemo, useState } from 'react'

import { useEffectExceptOnMount } from '@src/hooks/common/useRenderedOnce'
import { AvailableIcons } from '@src/mytypes'
import { Box } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'

interface ICheckBox {
  onCheck: (value: boolean) => void
  icon: AvailableIcons
  defaultIcon?: AvailableIcons
  value?: boolean
}

export const CheckBox = memo(({ onCheck, icon, value, defaultIcon }: ICheckBox) => {
  const { colors } = useAppTheme()

  const [isChecked, setIsChecked] = useState(value)

  const onPress = () => {
    onCheck?.(!isChecked)
    setIsChecked((prev) => !prev)
  }

  useEffectExceptOnMount(() => {
    setIsChecked(value)
  }, [value])

  const checkboxProps = useMemo(
    () =>
      isChecked ? { fill: colors.iconHLcolor, stroke: colors.iconHLcolor } : { stroke: colors.iconUnselectedColor },
    [isChecked, colors.iconHLcolor],
  )

  const Icon = Icons.svg[defaultIcon && !isChecked ? defaultIcon : icon]

  return (
    <Box effect="opacity" onPress={onPress} activeOpacity={0.8}>
      <Icon height={24} width={24} {...checkboxProps} />
    </Box>
  )
})
