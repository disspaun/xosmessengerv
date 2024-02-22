import { useCallback, useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Menu } from 'react-native-paper'

import { PaperMenuRow } from '@src/components/fields/PaperMenuRow'
import { TapGestureHandleContainer } from '@src/components/layout/TapGestureHandleContainer'

import { Document, Message } from '@src/draft/types'
import { useCopyToClipboard } from '@src/hooks/useCopyToClipboard'
import { useLocalization } from '@src/locales/localization'
import { PaperDivider } from '@src/theme/helpers/Divider'
import { useAppTheme } from '@src/theme/theme'
import { useSavePicture } from '@src/utils/cameraRoll'

interface IMessageMenu {
  contextMenuAnchorVisible: boolean
  closeMenu: () => void
  menuPosition: { x: number; y: number }
  item: Message
  document: Document | null
}

export let isMessageMenuVisibleRef = false

export const MessageMenu = ({ contextMenuAnchorVisible, closeMenu, menuPosition, item, document }: IMessageMenu) => {
  const { colors } = useAppTheme()
  const { t } = useLocalization()

  isMessageMenuVisibleRef = contextMenuAnchorVisible
  useEffect(() => {
    return () => {
      isMessageMenuVisibleRef = false
    }
  }, [])

  const isImage = document?.width || document?.height
  const { copyToClipboard } = useCopyToClipboard()

  const { savePicture } = useSavePicture({ type: 'photo' })

  const copyText = useCallback(() => {
    copyToClipboard(item.body)
    closeMenu()
  }, [copyToClipboard, item.body])

  const saveImage = useCallback(() => {
    if (!document?.path) {
      return closeMenu()
    }
    void savePicture(document?.path)
    closeMenu()
  }, [document?.path])

  return (
    <Menu
      visible={contextMenuAnchorVisible}
      onDismiss={closeMenu}
      contentStyle={{ backgroundColor: colors.menuBackgroundColor, borderRadius: 8 }}
      anchor={menuPosition}
    >
      <GestureHandlerRootView>
        <TapGestureHandleContainer key="1" onTap={closeMenu}>
          <PaperMenuRow leftIconName="reply" text={t('reply')} onPress={closeMenu} />
        </TapGestureHandleContainer>
        <TapGestureHandleContainer key="2" onTap={copyText}>
          <PaperMenuRow leftIconName="copy" text={t('copyText')} onPress={copyText} />
        </TapGestureHandleContainer>
        {isImage ? (
          <TapGestureHandleContainer key="3" onTap={closeMenu}>
            <PaperMenuRow leftIconName="copy" text={t('copyImage')} onPress={closeMenu} />
          </TapGestureHandleContainer>
        ) : null}
        {isImage ? (
          <TapGestureHandleContainer key="4" onTap={saveImage}>
            <PaperMenuRow leftIconName="save" text={t('saveImage')} onPress={saveImage} />
          </TapGestureHandleContainer>
        ) : null}

        <PaperDivider ml={16} mr={16} />
        <TapGestureHandleContainer key="5" onTap={closeMenu}>
          <PaperMenuRow leftIconName="pin" text={t('pinMessage')} onPress={closeMenu} />
        </TapGestureHandleContainer>
        <TapGestureHandleContainer key="6" onTap={closeMenu}>
          <PaperMenuRow leftIconName="trash" text={t('delete')} onPress={closeMenu} />
        </TapGestureHandleContainer>
      </GestureHandlerRootView>
    </Menu>
  )
}
