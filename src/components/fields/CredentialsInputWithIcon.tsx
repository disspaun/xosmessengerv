import { Icons } from '@assets'
import { forwardRef, memo, useCallback, useImperativeHandle, useRef, useState } from 'react'
import { StyleSheet, TextInput } from 'react-native'
import { TextInputProps, TextInputSubmitEditingEventData } from 'react-native/Libraries/Components/TextInput/TextInput'
import { LayoutChangeEvent, LayoutRectangle, NativeSyntheticEvent } from 'react-native/Libraries/Types/CoreEventTypes'

import { AvailableIcons } from '@src/mytypes'
import { Box } from '@src/theme/helpers/Box'
import { Gap } from '@src/theme/helpers/Gap'
import { fontStyles } from '@src/theme/text'
import { useAppTheme } from '@src/theme/theme'
import { useStyles } from '@src/theme/useStyles'

interface ICredentialsInputWithIcon extends Partial<Omit<TextInputProps, 'onFocus' | 'onChange'>> {
  placeholder: string
  leftIconName?: AvailableIcons
  secure?: boolean
  error?: string
  initialValue?: string
  onChange?: (value: string) => void
  height?: number
  onFocus?: (layoutRectangle: LayoutRectangle) => void
}

const getStyles = (theme: App.Theme, isFocused: boolean, multiline?: boolean, height?: number) => {
  const textColor = isFocused ? theme.colors.selectedInputTextColor : theme.colors.defaultInputTextColor

  const styles = StyleSheet.create({
    input: {
      ...fontStyles.body,
      color: textColor,
      flex: 1,
      alignSelf: 'center',
      ...(multiline && { height: 84, paddingTop: 12, textAlignVertical: 'top' }),
      ...(height && { height }),
    },
  })
  return styles
}

export type CredentialsInput = { input: TextInput; value: string }

export const CredentialsInputWithIcon = memo(
  forwardRef<CredentialsInput, ICredentialsInputWithIcon>(
    (
      {
        placeholder,
        leftIconName,
        secure,
        error,
        initialValue,
        onChange,
        height,
        onFocus,
        ...textInputProps
      }: ICredentialsInputWithIcon,
      ref,
    ) => {
      const [_value, _setValue] = useState(initialValue || '')
      const [isFocused, setIsFocused] = useState(!!initialValue)
      const styles = useStyles(getStyles, isFocused, textInputProps.multiline, height)
      const [secureTextEntry, setSecureTextEntry] = useState(!!secure)
      const { colors, dark } = useAppTheme()
      const inputRef = useRef<TextInput>(null)
      const [layoutRectangle, setLayoutRectangle] = useState<LayoutRectangle>({ x: 0, y: 0, width: 0, height: 0 })

      const iconFillColor = isFocused ? colors.iconColor : colors.defaultInputIconColor
      const inputStrokeColor = isFocused ? colors.selectedInputStrokeColor : colors.inputStrokeDefault

      useImperativeHandle(ref, () => {
        return {
          input: inputRef.current,
          value: _value,
        } as CredentialsInput
      })

      const handleFocus = useCallback(() => {
        setIsFocused(true)
        onFocus?.(layoutRectangle)
      }, [layoutRectangle, onFocus])

      const handleBlur = useCallback(() => {
        if (!_value) {
          setIsFocused(false)
        }
      }, [_value])

      const toggleSecureMode = useCallback(() => {
        setSecureTextEntry((prev) => !prev)
      }, [])

      const onLayout = useCallback((event: LayoutChangeEvent) => {
        setLayoutRectangle(event.nativeEvent.layout)
      }, [])

      const handleTextChanged = useCallback(
        (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
          onChange?.(e.nativeEvent.text)
          _setValue(e.nativeEvent.text)
          if (!e.nativeEvent.text) {
            setIsFocused(false)
            return
          }
          if (!isFocused) {
            setIsFocused(true)
          }
        },
        [onChange, isFocused],
      )

      const Icon = leftIconName ? Icons.svg[leftIconName] : null
      const SecureIcon = secure ? Icons.svg[secureTextEntry ? 'hidePassword' : 'showPassword'] : null

      console.log('credentials input render')

      return (
        <Box
          row
          pr={12}
          pl={12}
          borderWidth={1}
          borderRadius={8}
          borderColor={error ? colors.errorTextColor : inputStrokeColor}
          backgroundColor={colors.inputBackgroundColor}
        >
          {Icon ? (
            <Box pt={12} pb={12}>
              <Icon width={24} height={24} fill={iconFillColor} />
            </Box>
          ) : null}
          <Gap x={8} />
          <TextInput
            numberOfLines={textInputProps.multiline ? undefined : 1}
            {...textInputProps}
            ref={inputRef}
            value={_value}
            onLayout={onLayout}
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            onFocus={handleFocus}
            onChange={handleTextChanged}
            onBlur={handleBlur}
            style={styles.input}
            keyboardAppearance={dark ? 'dark' : 'light'}
            placeholderTextColor={colors.defaultInputTextColor}
          />
          <Gap x={8} />
          {secure && SecureIcon ? (
            <Box effect="none" pt={12} pb={12} onPress={toggleSecureMode}>
              <SecureIcon width={24} height={24} fill={iconFillColor} />
            </Box>
          ) : null}
        </Box>
      )
    },
  ),
)
