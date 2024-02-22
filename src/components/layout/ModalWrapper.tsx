import { FC, ReactElement } from 'react'
import { Modal, StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from 'react-native'

import { Box } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'

interface IModalWrapperProps {
  visible: boolean
  closeModal: () => void
  children: ReactElement | null
  justifyContent: ViewStyle['justifyContent']
  marginHorizontal?: number
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
})

export const ModalWrapper: FC<IModalWrapperProps> = ({
  visible,
  closeModal,
  children,
  justifyContent,
  marginHorizontal,
}) => {
  const { colors } = useAppTheme()

  return (
    <View collapsable={false} accessible={undefined}>
      <Modal
        accessible={undefined}
        animationType="fade"
        supportedOrientations={['portrait']}
        transparent={true}
        visible={visible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <Box flex justifyContent={justifyContent}>
          <Box
            m={24}
            mr={marginHorizontal || 16}
            ml={marginHorizontal || 16}
            pt={8}
            pb={8}
            borderRadius={8}
            backgroundColor={colors.menuBackgroundColor}
          >
            {children}
          </Box>
        </Box>
      </Modal>
    </View>
  )
}
