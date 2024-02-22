import { Icons } from '@assets'
import {
  Dispatch,
  SetStateAction,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  BackHandler,
  Dimensions,
  InteractionManager,
  Keyboard,
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  TextInput,
} from 'react-native'
import {
  TextInputContentSizeChangeEventData,
  TextInputSelectionChangeEventData,
} from 'react-native/Libraries/Components/TextInput/TextInput'
import { NativeSyntheticEvent } from 'react-native/Libraries/Types/CoreEventTypes'

import { ChatUnreadArrow } from '@src/components/controls/ChatUnreadArrow'
import { MessageAppend } from '@src/components/controls/MessageAppend'
import { dismissMessageMenu } from '@src/components/elements/Messages'
import EmojiPicker from '@src/components/emojiBar'
import { Emoji, Sticker } from '@src/components/emojiBar/interfaces'
import { TapePressable } from '@src/components/pressable/TapePressable'

import '@src/extensions/string.extensions'
import { sendMessage } from '@src/hooks/useChat'
import { useSystemKeyboardProvider } from '@src/providers/SystemProvider'
import { navigationRef } from '@src/routing/navigationRef'
import { Box } from '@src/theme/helpers/Box'
import { SmoothHeight } from '@src/theme/helpers/FakeView'
import { fontStyles } from '@src/theme/text'
import { useAppTheme } from '@src/theme/theme'
import { useStyles } from '@src/theme/useStyles'
import { hasAndroidPermission } from '@src/utils/cameraRoll'
import { isIOS } from '@src/utils/isIOS'

export const DEFAULT_KEYBOARD_HEIGHT = Dimensions.get('screen').height * 0.29

const getStyles = (theme: App.Theme) => {
  const styles = StyleSheet.create({
    input: {
      ...fontStyles.secondary,
      color: theme.colors.primaryTextColor,
      flex: 1,
      alignSelf: 'center',
      maxHeight: 240,
    },
    container: {
      shadowColor: isIOS ? theme.colors.backdrop : '',
      shadowOffset: { width: 0, height: -0.4 },
      shadowOpacity: 0.5,
      borderTopWidth: 0,

      elevation: 4,
    },
  })
  return styles
}

interface IMessageInput {
  sendMessage: typeof sendMessage
  from: string
}

export enum MessageInputState {
  Smile = 'smile',
  Keyboard = 'keyboard',
  Closed = 'closed',
}

export interface MessageInput {
  setInputState: Dispatch<SetStateAction<MessageInputState>>
  textInput: TextInput | null
  isFileMode: boolean
}

export const appendEmoji = (emoji: Emoji) => {
  appendEmojiRef?.(emoji)
}

export const clearInput = () => {
  clearInputRef?.()
}

export const dismissInputPanelIfVisible = () => {
  if (isInputPanelVisibleRef) {
    setInputStateRef?.(MessageInputState.Closed)
  }
}

export let isInputPanelVisibleRef = false
export let setInputStateRef: Dispatch<SetStateAction<MessageInputState>> | null = null
export let appendEmojiRef: (emoji: Emoji) => void | null
export let clearInputRef: () => void | null

interface IIntsertBetweenBySelection {
  firstPart: string
  setSelection: Dispatch<SetStateAction<{ start: number; end: number }>>
  secondPart?: string
}

const removeEmojiMatchOrPop = ({ firstPart, secondPart, setSelection }: IIntsertBetweenBySelection) => {
  let deletionLength = 1
  const squareBracketsWords = firstPart.match(/\[([^\s\]]*)\]/g)
  if (squareBracketsWords && firstPart[firstPart.length - 1] === ']') {
    const deletion = squareBracketsWords.pop()
    deletionLength = deletion?.length || 1
  }

  setSelection((prev) => {
    if (prev.start) {
      const newSelectionPosition = Math.max(0, prev.start - deletionLength)
      return { ...prev, start: newSelectionPosition, end: newSelectionPosition }
    }
    return prev
  })

  return firstPart.slice(0, -deletionLength) + (secondPart || '')
}

export const MessageInput = memo(
  forwardRef<MessageInput, IMessageInput>(({ sendMessage, from }: IMessageInput, ref) => {
    const styles = useStyles(getStyles)
    const [message, setMessage] = useState('')
    const [inputHeight, setInputHeight] = useState(0)
    const [document, setDocument] = useState<number[] | undefined>(undefined)
    const setMessageCallback = useCallback((message: string) => setMessage(message), [])
    const { colors, dark, insets } = useAppTheme()

    const [inputState, setInputState] = useState<MessageInputState>(MessageInputState.Closed)
    const textInputRef = useRef<TextInput>(null)
    const [fileMode, setFileMode] = useState(false)
    const [selection, setSelection] = useState({ start: 0, end: 0 })
    const { keyboardShown, keyboardHeight } = useSystemKeyboardProvider()
    const hasCameraRollPermissions = useRef<boolean | null>(null)
    const messageInputLayoutHeight = useRef(0)
    const height = keyboardHeight || DEFAULT_KEYBOARD_HEIGHT

    isInputPanelVisibleRef = inputState !== MessageInputState.Closed
    setInputStateRef = setInputState

    const requestFileModePermission = useCallback(async () => {
      hasCameraRollPermissions.current = await hasAndroidPermission()
    }, [])

    const toggleFileMode = useCallback(async () => {
      setInputState(MessageInputState.Closed)
      Keyboard.dismiss()

      if (!fileMode) {
        await requestFileModePermission()
      }

      setFileMode((prev) => !prev)
    }, [fileMode])

    const onRequestClose = useCallback(() => {
      if (isInputPanelVisibleRef) {
        setInputState(MessageInputState.Closed)
        Keyboard.dismiss()
        return true
      }
      if (fileMode) {
        void toggleFileMode()
        return true
      }

      navigationRef.goBack()
      return true
    }, [isInputPanelVisibleRef, fileMode, toggleFileMode])

    const onRequestKeyboardHide = useCallback(() => {
      const { isMessageMenuVisibleRef } = require('@src/components/menu/MessageMenu')
      if (isMessageMenuVisibleRef) {
        dismissMessageMenu()
        setInputState(MessageInputState.Closed)
      } else {
        if (inputState !== MessageInputState.Smile) {
          setInputState(MessageInputState.Closed)
        }
      }

      return true
    }, [inputState])

    const onKeyboardDidShow = useCallback(() => {
      setInputState(MessageInputState.Keyboard)
    }, [])

    useEffect(() => {
      return () => {
        isInputPanelVisibleRef = false
        setInputStateRef = null
        appendEmojiRef = null
        clearInputRef = null
      }
    }, [])

    useEffect(() => {
      const willShowSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow)

      return willShowSubscription.remove
    }, [onRequestKeyboardHide])

    useEffect(() => {
      if (!isIOS) {
        const hideSubscription = Keyboard.addListener('keyboardDidHide', onRequestKeyboardHide)

        return hideSubscription.remove
      }
    }, [onRequestKeyboardHide])

    useEffect(() => {
      if (!isIOS) {
        const backPressSubscription = BackHandler.addEventListener('hardwareBackPress', onRequestClose)

        return backPressSubscription.remove
      }
    }, [onRequestClose])

    useImperativeHandle(ref, () => {
      return {
        setInputState,
        textInput: textInputRef.current,
        isFileMode: fileMode,
      } as MessageInput
    })

    const sendMessageCallback = useCallback(() => {
      if (!message.trim() && !document) {
        return
      }
      if (!isIOS) {
        setInputHeight(0)
      }
      if (fileMode) {
        setFileMode(false)
      }
      void sendMessage({ message: message.trim(), from, documents: document, isFileModeEnabled: fileMode })
      setMessage('')
      setDocument(undefined)
    }, [message, document, fileMode])

    const toggleEmojiPicker = useCallback(() => {
      setInputState((prev) => {
        if (prev === MessageInputState.Smile) {
          InteractionManager.runAfterInteractions(() => {
            setTimeout(() => {
              !keyboardShown && textInputRef.current?.blur()
              textInputRef.current?.focus()
            }, 100)
          })

          return MessageInputState.Keyboard
        }
        Keyboard.dismiss()
        return MessageInputState.Smile
      })
    }, [keyboardShown])

    const onContentSizeChange = useCallback((e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      setInputHeight(e.nativeEvent?.contentSize?.height)
    }, [])

    const contentSize = useMemo(() => ({ height: Math.max(inputHeight || 0, 40) }), [inputHeight])

    appendEmojiRef = useCallback(
      (e: Emoji) => {
        const appendix = `[${e.name}]`
        setMessage((prev) => {
          return prev.insertAt(prev, appendix, selection.start)
        })
        setSelection((prev) => ({ ...prev, end: prev.end + appendix.length, start: prev.start + appendix.length }))
      },
      [selection],
    )

    clearInputRef = useCallback(() => {
      if (selection.start === 0 && selection.end === 0) {
        return
      }

      if (selection.start < selection.end) {
        setMessage((prev) => {
          return prev.replaceAt(selection.start, selection.end - selection.start, '')
        })
        setSelection((prev) => ({
          ...prev,
          end: prev.start,
        }))
        return
      } else if (selection.start < message.length) {
        setMessage((prev) => {
          const firstPart = prev.substring(0, selection.start)
          const secondPart = prev.substring(selection.start)

          return removeEmojiMatchOrPop({ firstPart, secondPart, setSelection })
        })

        return
      } else {
        setMessage((prev) => {
          if (!prev) {
            return prev
          }

          return removeEmojiMatchOrPop({ firstPart: prev, setSelection })
        })

        return
      }
    }, [selection, message.length])

    const sendSticker = useCallback((s: Sticker) => {
      void sendMessage({ sticker: s.name, from })
    }, [])

    const onSelectionChange = useCallback((e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
      setSelection(e.nativeEvent.selection)
    }, [])

    const propsByPlatform = useMemo(
      () => (isIOS ? { style: [styles.input] } : { onContentSizeChange, style: [styles.input, contentSize] }),
      [contentSize, styles.input],
    )

    const smoothHeight = useMemo(() => {
      return Platform.select({
        default: isInputPanelVisibleRef ? height : insets.bottom,
        android: isInputPanelVisibleRef ? height + insets.bottom : insets.bottom,
      })
    }, [isInputPanelVisibleRef, height, insets])

    const onLayout = useCallback((e: LayoutChangeEvent) => {
      messageInputLayoutHeight.current = e.nativeEvent?.layout?.height || 0
    }, [])

    return (
      <>
        {fileMode ? (
          <MessageAppend
            hasCameraRollPermissions={hasCameraRollPermissions.current}
            messageInputLayoutHeight={messageInputLayoutHeight.current}
            key="message_append"
            toggleFileMode={toggleFileMode}
            setDocument={setDocument}
            from={from}
          />
        ) : null}
        <Box
          backgroundColor={colors.mainBackground}
          style={isIOS ? styles.container : undefined}
          display={fileMode && !document ? 'none' : 'flex'}
          onLayout={onLayout}
          key="message_input"
          p={8}
          pt={6}
          pb={6}
          row
        >
          <TapePressable row alignSelf="center" onPress={toggleEmojiPicker} alignItems="center" pl={4} pr={4}>
            {[MessageInputState.Keyboard, MessageInputState.Closed].includes(inputState) ? (
              <Icons.svg.smile width={32} height={32} fill={colors.iconColor} />
            ) : (
              <Icons.svg.keyboard width={32} height={32} fill={colors.iconColor} />
            )}
          </TapePressable>
          <TextInput
            // keyboardType={isIOS ? 'ascii-capable' : 'visible-password'}
            value={message}
            {...propsByPlatform}
            selection={selection}
            showSoftInputOnFocus={inputState !== MessageInputState.Smile}
            onSelectionChange={onSelectionChange}
            keyboardAppearance={dark ? 'dark' : 'light'}
            onChangeText={setMessageCallback}
            multiline
            ref={textInputRef}
            placeholder="Type message"
            placeholderTextColor={colors.defaultInputTextColor}
          />
          {document ? null : (
            <TapePressable row alignSelf="center" onPress={toggleFileMode} alignItems="center" pl={4} pr={4}>
              <Icons.svg.attach width={32} height={32} fill={colors.iconColor} />
            </TapePressable>
          )}
          <TapePressable alignSelf="center" onPress={sendMessageCallback} pl={4} pr={4}>
            <Icons.svg.send width={32} height={32} fill={colors.iconColor} />
          </TapePressable>
        </Box>

        <ChatUnreadArrow display={!fileMode} from={from} />

        <SmoothHeight
          key="emoji_panel"
          height={smoothHeight}
          display={inputState === MessageInputState.Smile ? 'flex' : 'none'}
        >
          <EmojiPicker
            perLine={10}
            perLineStickers={5}
            autoFocus={false}
            onSelectSticker={sendSticker}
            backgroundColor={colors.mainBackground}
          />
        </SmoothHeight>
      </>
    )
  }),
)
