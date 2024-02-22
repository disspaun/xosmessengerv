import { FC, ReactElement, ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react'
import { InteractionManager, Keyboard, ViewStyle } from 'react-native'

import { ModalWrapper } from '@src/components/layout/ModalWrapper'

import { useHandleAppThemeColorChanges } from '@src/hooks/useHandleAppThemeColorChanges'
import { useSystemKeyboardProvider } from '@src/providers/SystemProvider'

export interface IModalParams {
  element: ReactElement | null
  justifyContent: ViewStyle['justifyContent']
  marginHorizontal?: number
}

export interface IModalProviderContextProps {
  setupModal: (modalData: IModalParams) => void
  closeModal: () => void
  modalVisible: boolean
}

const ModalContext = createContext<IModalProviderContextProps>({
  setupModal: () => {},
  closeModal: () => {},
  modalVisible: false,
})

interface IModalProviderProps {
  children: ReactNode
}

export const ModalProvider: FC<IModalProviderProps> = ({ children }) => {
  useHandleAppThemeColorChanges()

  const { keyboardShown } = useSystemKeyboardProvider()
  const [modalVisible, setModalVisible] = useState(false)
  const [_modalVisible, _setModalVisible] = useState(false)

  const [modal, setModal] = useState<IModalParams>({
    element: null,
    justifyContent: 'flex-end',
  })

  const setupModal = useCallback((modalData: IModalParams) => {
    Keyboard.dismiss()

    setModal(modalData)
    setModalVisible(true)
  }, [])

  useEffect(() => {
    if (!keyboardShown && modalVisible && !_modalVisible) {
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          _setModalVisible(true)
        }, 100)
      })
    }
  }, [keyboardShown, modalVisible, _modalVisible])

  const closeModal = useCallback(() => {
    setModalVisible(false)
    _setModalVisible(false)
  }, [])

  return (
    <ModalContext.Provider value={{ closeModal, setupModal, modalVisible }}>
      {children}
      <ModalWrapper
        visible={_modalVisible}
        closeModal={closeModal}
        justifyContent={modal.justifyContent}
        marginHorizontal={modal.marginHorizontal}
      >
        {modal.element}
      </ModalWrapper>
    </ModalContext.Provider>
  )
}

export const useModalContext = () => useContext(ModalContext)
