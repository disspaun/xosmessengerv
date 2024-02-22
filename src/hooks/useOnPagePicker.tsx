import { ReactElement, useCallback, useState } from 'react'

import { PickerRow } from '@src/components/fields/PickerRow'

import { AvailableIcons } from '@src/mytypes'
import { useModalContext } from '@src/providers/ModalProvider'
import { Box } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'

export interface IOnPagePicker<T> {
  text: string
  value: T
  leftComponent?: ReactElement
  icon?: AvailableIcons
}

export function useOnPagePicker<T extends string | number>(values: IOnPagePicker<T>[], defaultValue?: T | null) {
  const { setupModal } = useModalContext()
  const [pickedValue, setPickedValue] = useState<string | number>(defaultValue || '')
  const { colors } = useAppTheme()

  const onPick = useCallback((value: string | number) => setPickedValue(value), [])

  const openPicker = useCallback(() => {
    setupModal({
      element: (
        <Box backgroundColor={colors.menuBackgroundColor}>
          {values.map((item) => (
            <PickerRow
              key={item.value}
              text={item.text}
              value={item.value}
              leftComponent={item.leftComponent}
              onPick={onPick}
              leftIconName={item.icon}
              rightIconName={pickedValue === item.value ? 'checkFile' : undefined}
              selectedColor={colors.accentColor}
            />
          ))}
        </Box>
      ),
      justifyContent: 'flex-end',
    })
  }, [setupModal, pickedValue, colors.menuBackgroundColor])

  return { openPicker, pickedValue, setPickedValue }
}
