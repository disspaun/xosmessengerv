import { StyleSheet, TextInput } from 'react-native'

import { Box } from '@src/theme/helpers/Box'
import { fontStyles } from '@src/theme/text'
import { useAppTheme } from '@src/theme/theme'

interface IEmojiSearchInput {
  placeholder: string
  value: string
  autoFocus: boolean

  onFocus(): void
  onBlur(): void
  onChangeText(text: string): void
}

export const EmojiSearchInput = ({
  placeholder,
  value,
  onChangeText,
  autoFocus,
  onFocus,
  onBlur,
}: IEmojiSearchInput) => {
  const { colors, dark } = useAppTheme()
  return (
    <Box
      borderRadius={4}
      overflow="hidden"
      row
      alignItems="center"
      justifyContent="center"
      backgroundColor={colors.outMessageBackgroundColor}
    >
      <TextInput
        clearButtonMode="while-editing"
        style={[styles.input, { color: colors.primaryTextColor }]}
        returnKeyType="search"
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#999"
        underlineColorAndroid="transparent"
        autoFocus={autoFocus}
        onFocus={onFocus}
        onBlur={onBlur}
        keyboardAppearance={dark ? 'dark' : 'light'}
        autoCorrect={false}
      />
    </Box>
  )
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    padding: 4,
    ...fontStyles.body,
  },
})
