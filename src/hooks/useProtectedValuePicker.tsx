import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useCallback, useState } from 'react'

import { PickerRow } from '@src/components/fields/PickerRow'

import { useCustomAsyncStorage } from '@src/hooks/useAsyncStorage'
import { useModalContext } from '@src/providers/ModalProvider'
import { Box } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'
import { getAvailableProfiles } from '@src/ucore/actions'

export const useProtectedValuePicker = () => {
  const [lastLoggedInName] = useCustomAsyncStorage('@last_logged_in_name/string')
  const values = getAvailableProfiles()
  const _lastLoggedInName = values.find((item) => item === lastLoggedInName)
  const _initialPickedValue = _lastLoggedInName || values[0] || ''
  const { setupModal, closeModal } = useModalContext()
  const [pickedValue, setPickedValue] = useState(_initialPickedValue)
  const { colors } = useAppTheme()
  const navigation = useNavigation()

  const onPick = useCallback((value: string) => {
    setPickedValue(value)
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (pickedValue) {
        setPickedValue(_initialPickedValue)
      }
    }, [_initialPickedValue]),
  )

  const onDeleteIconPress = useCallback(
    (value: string) => () => {
      closeModal()
      navigation.navigate('deleteAccount', { name: value })
    },
    [closeModal],
  )

  const openPicker = useCallback(() => {
    if (!values?.length) {
      return
    }

    setupModal({
      element: (
        <Box backgroundColor={colors.menuBackgroundColor}>
          {values.map((item) => (
            <PickerRow
              key={item}
              text={item}
              value={item}
              onPick={onPick}
              onRightIconPress={onDeleteIconPress(item)}
              leftIconName="database"
              rightIconName="trash"
            />
          ))}
        </Box>
      ),
      justifyContent: 'flex-end',
    })
  }, [setupModal, colors.menuBackgroundColor, values])

  return { openPicker, pickedValue }
}
