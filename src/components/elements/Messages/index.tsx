import { Icons } from '@assets'
import { Dispatch, SetStateAction, memo, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, Image, Keyboard, LayoutChangeEvent, Platform, StyleSheet } from 'react-native'
import FileViewer from 'react-native-file-viewer'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { TouchData } from 'react-native-gesture-handler/src/handlers/gestureHandlerCommon'

import { ScalableImage } from '@src/components/elements/images/ScalableImage'
import { ParsedText } from '@src/components/elements/text/ParsedText'
import { StickersHashMap } from '@src/components/emojiBar/data'
import {
  setImageViewerContact,
  setImageViewerImagePath,
  setImageViewerVisible,
} from '@src/components/layout/ImageViewer'
import { MessageMenu } from '@src/components/menu/MessageMenu'

import { ChatRepository, DocumentRepository } from '@src/database/repositories'
import { Document, Message } from '@src/draft/types'
import { basicStyles } from '@src/theme/basicStyles'
import { Box } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'
import { isIOS } from '@src/utils/isIOS'
import { returnTrueCallback } from '@src/utils/misc'
import { createAtFormatChatShort } from '@src/utils/time'

interface IMessage {
  item: Message
}

const styles = StyleSheet.create({
  filePlaceholder: { width: '100%', minWidth: 180, height: 120 },
  imagePlaceholder: { height: 320, width: Dimensions.get('screen').width - 60 },
  sticker: { height: 256, width: 256, resizeMode: 'contain' },
})

export let messageRowMenuControllerRef: null | Dispatch<SetStateAction<boolean>> = null
export let contextMenuAnchorVisibleControllerRef: null | Dispatch<SetStateAction<boolean>> = null

export const dismissMessageMenu = () => {
  messageRowMenuControllerRef?.(false)
  contextMenuAnchorVisibleControllerRef?.(false)
}

const documents = new Map<number, Document>()

export const MessageRow = memo(({ item }: IMessage) => {
  // console.log('message rendered', item.documents)
  const { colors, insets } = useAppTheme()
  const incoming = item.from !== 'Me'
  const messageDocument = useRef(documents.get(item.documents?.[0]))
  const [document, setDocument] = useState<Document | null>(messageDocument.current || null)
  const [contextMenuVisible, setContextMenuVisible] = useState(false)
  const [contextMenuAnchorVisible, setContextMenuAnchorVisible] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const [messageWidth, setMessageWidth] = useState(0)
  const [isImageFitted, setIsImageFitted] = useState(true)

  const handleImageOnSize = useCallback(() => {
    setIsImageFitted(true)
  }, [])

  messageRowMenuControllerRef = setContextMenuVisible
  contextMenuAnchorVisibleControllerRef = setContextMenuAnchorVisible

  const loadDocument = useCallback(async () => {
    if (messageDocument.current) {
      return
    }
    const asset = await DocumentRepository.findOne({ where: { id: item.documents?.[0] } })
    setDocument(asset)
    documents.set(item.documents?.[0], asset)
  }, [item.documents])

  const containerAlignSelf = incoming ? 'flex-start' : 'flex-end'

  const containerDirectionalMargin = useMemo(() => (incoming ? { mr: 32 } : { ml: 32 }), [incoming])

  const isDocument = item?.documents?.length

  useLayoutEffect(() => {
    if (!isDocument) {
      return
    }
    void loadDocument()
  }, [item.documents])

  const openFile = useCallback(() => {
    if (!document?.path) {
      return null
    }
    console.log('opening file', document?.path)

    FileViewer.open(decodeURIComponent(document?.path))
  }, [document])

  const showPicture = useCallback(() => {
    if (!document?.path) {
      return
    }

    Keyboard.dismiss()
    ChatRepository.findOne({ where: { from: item.from } })
      .then((chat) => {
        setImageViewerContact?.({ ...(chat ? { ...chat } : { name: 'Me' }), timestamp: item.timestamp })
        setImageViewerVisible?.(true)
        setImageViewerImagePath?.(document?.path)
      })
      .catch(() => {})
  }, [document?.path, item.timestamp])

  const isImage = document?.width || document?.height

  const menuHeight = isImage
    ? Platform.select({ android: 425, default: 350 })
    : Platform.select({ android: 325, default: 250 })

  const openMenu = useCallback(
    (e: TouchData) => {
      const { isInputPanelVisibleRef } = require('@src/components/controls/MessageInput')
      const yScreen = e.absoluteY - (isInputPanelVisibleRef ? insets.bottom : 0)
      let yOffset = yScreen
      const { keyboardHeightRef } = require('@src/hooks/useKeyboard')
      if (isInputPanelVisibleRef) {
        const test = Dimensions.get('screen').height - yScreen - keyboardHeightRef
        if (test < menuHeight) {
          yOffset -= menuHeight - test
        }
      }
      setMenuPosition({ x: e.absoluteX, y: yOffset })
      setContextMenuVisible(true)
      setTimeout(() => setContextMenuAnchorVisible(true), 250)
    },
    [menuHeight],
  )

  const documentRender = useMemo(() => {
    if (!document?.path) {
      return null
    }
    if (isImage) {
      return (
        <ScalableImage
          onPress={showPicture}
          originalWidth={document?.width}
          originalHeight={document?.height}
          source={{ uri: document?.path }}
          messageWidth={messageWidth}
          width={styles.imagePlaceholder.width}
          height={styles.imagePlaceholder.height}
          style={basicStyles.alignSelfCenter}
          onSize={handleImageOnSize}
        />
      )
    } else if (document?.path) {
      return (
        <Box style={styles.filePlaceholder} justifyContent="center" alignItems="center" onPress={openFile}>
          <Icons.svg.attach width={64} height={64} fill={colors.iconColor} />
        </Box>
      )
    }
    return null
  }, [document, colors.primaryTextColor, messageWidth, isImage, isDocument])

  const stickerRender = useMemo(() => {
    if (!item.sticker) {
      return null
    }
    const imageSrc = StickersHashMap.get(item.sticker)?.sticker
    return <Image source={imageSrc} style={styles.sticker} />
  }, [item.sticker])

  const closeMenu = useCallback(() => {
    setContextMenuVisible(false)
    setContextMenuAnchorVisible(false)
  }, [])

  const backgroundColor = useMemo(() => {
    if (incoming) {
      return contextMenuAnchorVisible ? colors.inSelectMessageBackgroundColor : colors.inMessageBackgroundColor
    }
    return contextMenuAnchorVisible ? colors.outSelectMessageBackgroundColor : colors.outMessageBackgroundColor
  }, [
    contextMenuAnchorVisible,
    colors.outSelectMessageBackgroundColor,
    colors.outMessageBackgroundColor,
    colors.inMessageBackgroundColor,
    colors.inSelectMessageBackgroundColor,
    item.sticker,
  ])

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setMessageWidth(e.nativeEvent.layout.width)
  }, [])

  const emptyBodyTimestamp = useMemo(() => {
    if (isDocument && !document?.path) {
      return null
    }
    if (isImage && !isImageFitted) {
      return null
    }
    return (
      <Box
        key="message_timestamp"
        absolute
        backgroundColor={item.sticker ? undefined : colors.timeBgImage}
        bottom={4}
        right={4}
        p={4}
        pt={2}
        pb={2}
        borderRadius={4}
      >
        <Text colorName={item.sticker ? 'secondaryText' : 'white'} type="tiny">
          {createAtFormatChatShort(Number(item.timestamp))}
        </Text>
      </Box>
    )
  }, [document?.path, item.timestamp, item.sticker, colors.timeBgImage, isImage, isImageFitted])

  const gesture = useMemo(() => Gesture.LongPress().onStart(openMenu), [openMenu])

  return (
    <>
      <GestureDetector gesture={gesture}>
        <Box mt={8} alignSelf={containerAlignSelf} onLayout={onLayout} {...containerDirectionalMargin}>
          <Box
            borderRadius={8}
            mb={8}
            backgroundColor={backgroundColor}
            onLongPress={returnTrueCallback}
            activeOpacity={isIOS ? undefined : 0.8}
            effect={isIOS ? 'scale' : 'gestureHandler'}
          >
            <>
              {stickerRender}
              {documentRender}
              {item.body ? (
                <Box key="message_body" p={8} pt={8} pb={8}>
                  <ParsedText lineHeight={20} text={item.body} type="secondary" colorName="primaryTextColor" />
                  <Box mt={4} alignSelf="flex-end">
                    <Text colorName="secondaryText" type="tiny">
                      {createAtFormatChatShort(Number(item.timestamp))}
                    </Text>
                  </Box>
                </Box>
              ) : (
                emptyBodyTimestamp
              )}
            </>
          </Box>
        </Box>
      </GestureDetector>
      {/* TODO move out to parents */}
      {contextMenuVisible ? (
        <MessageMenu
          contextMenuAnchorVisible={contextMenuAnchorVisible}
          closeMenu={closeMenu}
          menuPosition={menuPosition}
          item={item}
          document={document}
        />
      ) : null}
    </>
  )
})
