import { Icons } from '@assets'
import { ReactElement, memo, useCallback } from 'react'

import { AvailableColors, AvailableIcons } from '@src/mytypes'
import { useModalContext } from '@src/providers/ModalProvider'
import { Box } from '@src/theme/helpers/Box'
import { Gap } from '@src/theme/helpers/Gap'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'

interface IPickerRow {
  text: string
  value: string | number
  onPick: (value: string | number) => void
  onRightIconPress?: () => void
  selectedColor?: AvailableColors
  leftIconName?: AvailableIcons
  leftComponent?: ReactElement
  rightIconName?: AvailableIcons
}

export const PickerRow = memo(
  ({
    leftIconName,
    text,
    rightIconName,
    onRightIconPress,
    onPick,
    value,
    selectedColor,
    leftComponent,
  }: IPickerRow) => {
    const { colors } = useAppTheme()
    const Icon = leftIconName ? Icons.svg[leftIconName] : null
    const RightIcon = rightIconName ? Icons.svg[rightIconName] : null
    const { closeModal } = useModalContext()

    const onPress = useCallback(() => {
      onPick(value)
      closeModal()
    }, [onPick, closeModal, value])

    return (
      <Box
        row
        p={12}
        onPress={onPress}
        effect="ripple"
        rippleColor={colors.tapHLColor}
        backgroundColor={colors.menuBackgroundColor}
      >
        <>
          {Icon ? <Icon width={24} height={24} fill={colors.iconColor} /> : null}
          {leftComponent}
          <Gap x={8} />
          <Box justifyContent="flex-start" flex alignSelf="center">
            <Text type="body">{text}</Text>
          </Box>

          <Gap x={8} />
          {RightIcon ? (
            <Box effect="none" alignSelf="center" onPress={onRightIconPress}>
              <RightIcon width={24} height={24} fill={selectedColor || colors.iconColor} />
            </Box>
          ) : null}
        </>
      </Box>
    )
  },
)
