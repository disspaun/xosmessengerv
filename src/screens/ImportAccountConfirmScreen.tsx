import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { FormValidationError } from '@src/components/elements/formBody/FormValidationError'
import { CredentialsInput, CredentialsInputWithIcon } from '@src/components/fields/CredentialsInputWithIcon'
import { Header } from '@src/components/nav/Header'
import { MainButton } from '@src/components/pressable/MainButton'

import { useAwareInputWithScroll } from '@src/hooks/useAwareInputWithScroll'
import { IUseCredentialsFrom, useForm } from '@src/hooks/useForm'
import { useHandleInputTaps } from '@src/hooks/useHandleInputTaps'
import { ScreenProps } from '@src/routing/NavigationTypes'
import { LeftBack } from '@src/screens/ChatScreen'
import { AndroidOnlyGap } from '@src/theme/helpers/AndroidOnlyGap'
import { Box } from '@src/theme/helpers/Box'
import { FakeView } from '@src/theme/helpers/FakeView'
import { Gap } from '@src/theme/helpers/Gap'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'

type importAccountForm = 'nickname' | 'password' | 'confirmPassword'

const importAccountFormData = {
  initialState: { nickname: '', password: '', confirmPassword: '' },
  validators: {
    nickname: (value) => value.length < 3,
    password: (value) => value.length < 6,
    confirmPassword: (value, state) => value.length < 6 || state.password !== state.confirmPassword,
  },
  onSubmit: (values) => {
    // console.log(values)
    // navigation.navigate('startup')
  },
} as IUseCredentialsFrom<importAccountForm>

export const ImportAccountConfirmScreen = ({ navigation, route }: ScreenProps<'importAccountConfirm'>) => {
  const { colors, insets } = useAppTheme()
  const { t } = useTranslation()
  const scrollViewRef = useRef<ScrollView>(null)

  const inputsRef = useRef<Record<string, CredentialsInput | null>>({
    nickname: null,
    password: null,
    confirmPassword: null,
  })

  const { onLayout, onFocus, handleInputFocusedWithScrollview } = useAwareInputWithScroll(scrollViewRef, 32, 300)

  const { handleOnChange, submitHandler, disabled, initialState, errors, displayError } =
    useForm<importAccountForm>(importAccountFormData)

  const submitButtonDisabled = disabled

  const handleSubmit = useCallback(() => {
    submitHandler()
  }, [submitHandler])

  const { continueSurvey } = useHandleInputTaps(inputsRef)

  return (
    <Box flex backgroundColor={colors.mainBackground}>
      <Header
        title={t('importUtopiaAccount')}
        left={
          <Box justifyContent="center" flex>
            <LeftBack alignSelf="flex-start" navigation={navigation} />
          </Box>
        }
      />
      <Gap y={24} />
      <Box flex>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          bounces={false}
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          onScroll={handleInputFocusedWithScrollview}
        >
          <Box pl={32} pr={32}>
            <Text type="body">{t('signUpDesc')}</Text>
            <Gap y={32} />
            <CredentialsInputWithIcon
              placeholder={t('nickname')}
              initialValue={initialState.nickname}
              leftIconName="user"
              error={errors.nickname}
              ref={(ref) => (inputsRef.current.nickname = ref)}
              onSubmitEditing={continueSurvey('password')}
              onChange={handleOnChange('nickname')}
              blurOnSubmit={false}
            />
            <Gap y={16} />
            <Box onLayout={onLayout(2)}>
              <CredentialsInputWithIcon
                placeholder={t('password')}
                leftIconName="password"
                error={errors.password}
                secure
                ref={(ref) => (inputsRef.current.password = ref)}
                onSubmitEditing={continueSurvey('confirmPassword')}
                onChange={handleOnChange('password')}
                blurOnSubmit={false}
                onFocus={onFocus(2)}
              />
            </Box>
            <Gap y={16} />
            <Box onLayout={onLayout(3)}>
              <CredentialsInputWithIcon
                placeholder={t('confirmPassword')}
                leftIconName="password"
                error={errors.confirmPassword}
                secure
                ref={(ref) => (inputsRef.current.confirmPassword = ref)}
                onChange={handleOnChange('confirmPassword')}
                blurOnSubmit={false}
                onFocus={onFocus(3)}
              />
            </Box>
            <Gap y={8} />
            <FormValidationError disabled={disabled} errorText={displayError} />
          </Box>
        </ScrollView>
      </Box>
      <MainButton disabled={submitButtonDisabled} ml={32} mr={32} text={t('createAccount')} onPress={handleSubmit} />
      <FakeView />
      <Gap y={insets.bottom} />
      <AndroidOnlyGap height={16} />
    </Box>
  )
}
