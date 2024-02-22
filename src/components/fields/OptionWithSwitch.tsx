import { Icons } from '@assets'
import { memo, useMemo, useState } from 'react'
import { Switch } from 'react-native'

import { useEffectExceptOnMount } from '@src/hooks/common/useRenderedOnce'
import { AvailableIcons } from '@src/mytypes'
import { basicStyles } from '@src/theme/basicStyles'
import { Box, BoxProps } from '@src/theme/helpers/Box'
import { Gap } from '@src/theme/helpers/Gap'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'

interface IOptionWithSwitch extends Partial<BoxProps> {
  text: string
  value: boolean
  onSwitch: (value: boolean) => void
  leftIconName?: AvailableIcons
}

export const OptionWithSwitch = memo(({ text, onSwitch, leftIconName, value, ...boxProps }: IOptionWithSwitch) => {
  const { colors } = useAppTheme()
  const [isEnabled, setIsEnabled] = useState(value)
  const toggleSwitch = () => {
    onSwitch(!isEnabled)
    setIsEnabled((prev) => !prev)
  }
  const Icon = leftIconName ? Icons.svg[leftIconName] : null

  useEffectExceptOnMount(() => {
    setIsEnabled(value)
  }, [value])

  const trackColor = useMemo(() => ({ false: colors.disableSwitch, true: colors.iconHLcolor }), [colors.iconHLcolor])

  return (
    <Box pt={10} pb={10} row {...boxProps}>
      {Icon ? <Icon width={24} height={24} fill={colors.iconColor} style={basicStyles.alignSelfCenter} /> : null}
      {Icon ? <Gap x={8} /> : null}
      <Text numberOfLines={1} flex type="body">
        {text}
      </Text>
      <Gap x={8} />
      <Switch thumbColor={colors.white} trackColor={trackColor} value={isEnabled} onValueChange={toggleSwitch} />
    </Box>
  )
})
