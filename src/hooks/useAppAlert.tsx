import { useCallback } from 'react'

import { useModalContext } from '@src/providers/ModalProvider'
import { Box } from '@src/theme/helpers/Box'
import { AlertHorizontalDivider, AlertVerticalDivider } from '@src/theme/helpers/Divider'
import { Gap } from '@src/theme/helpers/Gap'
import { useAppTheme } from '@src/theme/theme'
import { Text, TextProps } from '@src/theme/themed'

interface Action {
  text: string
  onPress?: () => void
}

interface IUseAppAlert {
  title: string
  description: string
  actions: Action[]
  descTextProps?: TextProps
}

export const useAppAlert = ({ title, description, actions, descTextProps }: IUseAppAlert) => {
  const { setupModal, closeModal } = useModalContext()

  const { colors } = useAppTheme()

  const hideAlert = useCallback(() => {
    closeModal()
  }, [closeModal])

  const onOptionPress = useCallback(
    (optionOnPress?: () => void) => () => {
      hideAlert()
      optionOnPress?.()
    },
    [],
  )

  const showAlert = useCallback(() => {
    setupModal({
      element: (
        <Box backgroundColor={colors.menuBackgroundColor}>
          <Box p={20} justifyContent="center" alignItems="center">
            <Text type="body" weight="medium">
              {title}
            </Text>
            <Gap y={12} />
            <Text center type="secondary" {...descTextProps}>
              {description}
            </Text>
          </Box>
          <AlertHorizontalDivider />
          <Box row justifyContent="space-between">
            {actions.map((item, index) => [
              <Box
                key={item.text}
                mt={12}
                mb={12}
                onPress={onOptionPress(item.onPress) || hideAlert}
                justifyContent="center"
                flex
                alignItems="center"
              >
                <Text type="body" weight="medium" colorName="buttonColor">
                  {item.text}
                </Text>
              </Box>,
              <>{![actions.length - 1].includes(index) ? <AlertVerticalDivider /> : null}</>,
            ])}
          </Box>
        </Box>
      ),
      justifyContent: 'center',
      marginHorizontal: 36,
    })
  }, [setupModal, colors.menuBackgroundColor, descTextProps])

  return { showAlert }
}
