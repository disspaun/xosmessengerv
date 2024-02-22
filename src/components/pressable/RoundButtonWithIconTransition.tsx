import { Icons } from '@assets'
import { memo, useCallback, useState } from 'react'

import { AvailableColors, AvailableIcons } from '@src/mytypes'
import { Box } from '@src/theme/helpers/Box'

interface IRoundButtonWithIconTransition {
  onPress: () => void
  fillColorDefault: AvailableColors
  fillColorHL: AvailableColors
  backgroundColor: AvailableColors
  rippleColor: AvailableColors
  icon: AvailableIcons
}

export const RoundButtonWithIconTransition = memo(
  ({ fillColorDefault, fillColorHL, backgroundColor, rippleColor, onPress, icon }: IRoundButtonWithIconTransition) => {
    const [fillColor, setFillColor] = useState(fillColorDefault)

    const onTouchStart = useCallback(() => {
      setFillColor(fillColorHL)
    }, [fillColorHL])

    const onTouchEnd = useCallback(() => {
      setFillColor(fillColorDefault)
    }, [fillColorDefault])

    const Icon = Icons.svg[icon]

    return (
      <Box borderRadius={20} overflow="hidden">
        <Box
          p={8}
          backgroundColor={backgroundColor}
          effect="ripple"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          rippleColor={rippleColor}
          onPress={onPress}
        >
          <Icon width={24} height={24} fill={fillColor} />
        </Box>
      </Box>
    )
  },
)
