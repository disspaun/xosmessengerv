import { Icons } from '@assets'
import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { FormValidationError } from '@src/components/elements/formBody/FormValidationError'
import { CredentialsInput, CredentialsInputWithIcon } from '@src/components/fields/CredentialsInputWithIcon'
import { Header } from '@src/components/nav/Header'
import { MainButton } from '@src/components/pressable/MainButton'
import { SecondaryButton } from '@src/components/pressable/SecondaryButton'

import { useAwareInputWithScroll } from '@src/hooks/useAwareInputWithScroll'
import { IUseCredentialsFrom, useForm } from '@src/hooks/useForm'
import { useHandleInputTaps } from '@src/hooks/useHandleInputTaps'
import { ScreenProps } from '@src/routing/NavigationTypes'
import { navigationRef } from '@src/routing/navigationRef'
import { LeftBack } from '@src/screens/ChatScreen'
import { AndroidOnlyGap } from '@src/theme/helpers/AndroidOnlyGap'
import { Box } from '@src/theme/helpers/Box'
import { FakeView } from '@src/theme/helpers/FakeView'
import { Gap } from '@src/theme/helpers/Gap'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'

type addContactForm = 'publickey' | 'optionalNickname'

const addContactFormData = {
  initialState: { publickey: '', optionalNickname: '' },
  validators: {
    publickey: (value) => value.length < 64 || value.length > 64,
    optionalNickname: (value) => value.length < 3,
  },
  onSubmit: (values) => {
    navigationRef.goBack()
  },
} as IUseCredentialsFrom<addContactForm>

export const AddContactScreen = ({ navigation, route }: ScreenProps<'addContact'>) => {
  const { colors, insets, dark } = useAppTheme()
  const { t } = useTranslation()
  const scrollViewRef = useRef<ScrollView>(null)
  const { onLayout, onFocus, handleInputFocusedWithScrollview } = useAwareInputWithScroll(scrollViewRef, 16)

  const inputsRef = useRef<Record<string, CredentialsInput | null>>({
    publickey: null,
    nickname: null,
  })

  const { continueSurvey } = useHandleInputTaps(inputsRef)

  const { handleOnChange, submitHandler, disabled, errors, displayError } = useForm<addContactForm>(addContactFormData)

  const scanCode = useCallback(() => {
    navigation.push('scanCode')
  }, [])

  return (
    <Box flex backgroundColor={colors.mainBackground}>
      <Header
        title={t('addContact')}
        left={
          <Box justifyContent="center" flex>
            <LeftBack alignSelf="flex-start" navigation={navigation} />
          </Box>
        }
      />
      <Box flex mt={24}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          bounces={false}
          onScroll={handleInputFocusedWithScrollview}
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
        >
          <Box pl={32} pr={32}>
            <Text>{t('addContactDesc')}</Text>

            <Gap y={24} />
            <Box alignSelf="center">
              <Icons.svg.avatar
                width={100}
                height={100}
                fill={dark ? colors.inMessageBackgroundColor : colors.disabledButtonColor}
              />
            </Box>
            <Gap y={24} />
            <Box onLayout={onLayout(1)}>
              <CredentialsInputWithIcon
                multiline
                error={errors.publickey}
                ref={(ref) => (inputsRef.current.publickey = ref)}
                placeholder={t('publicKey')}
                leftIconName="publickey"
                onSubmitEditing={continueSurvey('nickname')}
                onChange={handleOnChange('publickey')}
                onFocus={onFocus(1)}
              />
            </Box>

            <Gap y={16} />
            <Box onLayout={onLayout(2)}>
              <CredentialsInputWithIcon
                placeholder={t('optionalNickname')}
                leftIconName="user"
                error={errors.optionalNickname}
                ref={(ref) => (inputsRef.current.nickname = ref)}
                onChange={handleOnChange('optionalNickname')}
                onFocus={onFocus(2)}
              />
            </Box>
            <Gap y={8} />
            <FormValidationError disabled={disabled} errorText={displayError} />
          </Box>
        </ScrollView>
      </Box>
      <Gap y={12} />
      <SecondaryButton text={t('scanUcode')} ml={32} mr={32} onPress={scanCode} leftIconName="ucode" />
      <Gap y={16} />
      <MainButton disabled={disabled} ml={32} mr={32} text={t('add')} onPress={submitHandler} />
      <FakeView />

      <Gap y={insets.bottom} />
      <AndroidOnlyGap height={16} />
    </Box>
  )
}
