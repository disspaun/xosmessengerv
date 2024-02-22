import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { TermsBlock } from '@src/components/controls/TermsBlock'
import { FormValidationError } from '@src/components/elements/formBody/FormValidationError'
import { CredentialsInput, CredentialsInputWithIcon } from '@src/components/fields/CredentialsInputWithIcon'
import { RadioButtonOption } from '@src/components/fields/RadioButtonOption'
import { Header } from '@src/components/nav/Header'
import { MainButton } from '@src/components/pressable/MainButton'

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

type existingAccountForm = 'account' | 'password'

const existingAccountFormData = {
  initialState: { account: '', password: '' },
  validators: {
    account: (value) => value.length < 3,
    password: (value) => value.length < 6,
  },
  onSubmit: (values) => {
    // alert(JSON.stringify(values))
    // navigation.navigate('startup')
  },
} as IUseCredentialsFrom<existingAccountForm>

type privateKeyAccountForm = 'privateKey'

const privateKeyAccountFormData = {
  initialState: { privateKey: '' },
  validators: {
    privateKey: (value) => value.length < 64 || value.length > 64,
  },
  onSubmit: (values) => {
    alert(JSON.stringify(values))
    navigationRef.navigate('importAccountConfirm')
  },
} as IUseCredentialsFrom<privateKeyAccountForm>

type seedPhraseAccountForm = 'seedPhrase'

const seedPhraseAccountFormData = {
  initialState: { seedPhrase: '' },
  validators: {
    seedPhrase: (value) => value.length < 12,
  },
  onSubmit: (values) => {
    alert(JSON.stringify(values))
    navigationRef.navigate('importAccountConfirm')
  },
} as IUseCredentialsFrom<seedPhraseAccountForm>

export const ImportAccountFormScreen = ({ navigation }: ScreenProps<'importAccountForm'>) => {
  const [checked, setChecked] = useState('existing')
  const { colors, insets } = useAppTheme()
  const { t } = useTranslation()
  const [privacyCheck, setPrivacyCheck] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)

  const existing = checked === 'existing'

  const { onLayout, onFocus, handleInputFocusedWithScrollview } = useAwareInputWithScroll(scrollViewRef, 16)

  const inputsRef = useRef<Record<string, CredentialsInput | null>>({
    nickname: null,
    password: null,
    privateKey: null,
    seedPhrase: null,
  })

  const { continueSurvey } = useHandleInputTaps(inputsRef)

  const {
    handleOnChange: handleOnChangeExisting,
    submitHandler: submitHandlerExisting,
    disabled: disabledExisting,
    inputState: stateExisting,
    errors: errorsExisting,
    displayError: displayErrorExisting,
  } = useForm<existingAccountForm>(existingAccountFormData)

  const {
    handleOnChange: handleOnchangePrivate,
    submitHandler: submitHandlerPrivate,
    disabled: disabledPrivate,
    inputState: statePrivate,
    errors: errorsPrivate,
    displayError: displayErrorPrivate,
  } = useForm<privateKeyAccountForm>(privateKeyAccountFormData)

  const {
    handleOnChange: handleOnchangeSeed,
    submitHandler: submitHandlerSeed,
    disabled: disabledSeed,
    inputState: stateSeed,
    errors: errorsSeed,
    displayError: displayErrorSeed,
  } = useForm<seedPhraseAccountForm>(seedPhraseAccountFormData)

  const privateKey = checked === 'private'

  const disabled = useMemo(() => {
    if (existing) {
      return disabledExisting
    }
    if (privateKey) {
      return disabledPrivate
    }
    return disabledSeed
  }, [privacyCheck, privateKey, disabledExisting, disabledPrivate, disabledSeed, existing])

  const submitHandler = useMemo(() => {
    if (existing) {
      return submitHandlerExisting
    }
    if (privateKey) {
      return submitHandlerPrivate
    }
    return submitHandlerSeed
  }, [existing, privateKey, submitHandlerExisting, submitHandlerPrivate, submitHandlerSeed])

  const displayError = useMemo(() => {
    if (existing) {
      return displayErrorExisting
    }
    if (privateKey) {
      return displayErrorPrivate
    }
    return displayErrorSeed
  }, [existing, privateKey, displayErrorSeed, displayErrorExisting, displayErrorPrivate])

  const tip = existing ? t('importAccountMethodDesc') : t('enterPrivateKeyDesc')

  return (
    <Box flex backgroundColor={colors.mainBackground} pb={insets.bottom}>
      <Header
        title={t('importUtopiaAccount')}
        left={
          <Box justifyContent="center" flex>
            <LeftBack alignSelf="flex-start" navigation={navigation} />
          </Box>
        }
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onScroll={handleInputFocusedWithScrollview}
        ref={scrollViewRef}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <Box flex pt={24} pl={32} pr={32}>
          <Text>{tip}</Text>
          <Gap y={32} />
          <RadioButtonOption
            label={t('loginToExistingContainer')}
            checked={checked}
            onChange={setChecked}
            value="existing"
          />
          <Gap y={32} />
          <RadioButtonOption label={t('privateKey')} checked={checked} onChange={setChecked} value="private" />
          <Gap y={32} />
          <RadioButtonOption label={t('seedPhrase')} checked={checked} onChange={setChecked} value="seed" />
          <Gap y={32} />
          {existing ? (
            <>
              <Box onLayout={onLayout(1)}>
                <CredentialsInputWithIcon
                  onChange={handleOnChangeExisting('account')}
                  placeholder={t('nickname')}
                  ref={(ref) => (inputsRef.current.nickname = ref)}
                  onSubmitEditing={continueSurvey('password')}
                  leftIconName="user"
                  error={errorsExisting.account}
                  blurOnSubmit={false}
                  initialValue={stateExisting.account}
                  onFocus={onFocus(1)}
                />
              </Box>
              <Gap y={16} />
              <Box onLayout={onLayout(2)}>
                <CredentialsInputWithIcon
                  onChange={handleOnChangeExisting('password')}
                  placeholder={t('password')}
                  error={errorsExisting.password}
                  ref={(ref) => (inputsRef.current.password = ref)}
                  leftIconName="password"
                  initialValue={stateExisting.password}
                  onFocus={onFocus(2)}
                  secure
                />
              </Box>
            </>
          ) : null}
          {checked === 'private' ? (
            <Box onLayout={onLayout(3)}>
              <CredentialsInputWithIcon
                multiline
                error={errorsPrivate.privateKey}
                placeholder={t('enterPrivateKey')}
                initialValue={statePrivate.privateKey}
                ref={(ref) => (inputsRef.current.privateKey = ref)}
                onChange={handleOnchangePrivate('privateKey')}
                onFocus={onFocus(3)}
                height={156}
              />
            </Box>
          ) : null}
          {checked === 'seed' ? (
            <Box onLayout={onLayout(4)}>
              <CredentialsInputWithIcon
                multiline
                error={errorsSeed.seedPhrase}
                initialValue={stateSeed.seedPhrase}
                placeholder={t('enterSeedPhrase')}
                ref={(ref) => (inputsRef.current.seedPhrase = ref)}
                onChange={handleOnchangeSeed('seedPhrase')}
                onFocus={onFocus(4)}
                height={156}
              />
            </Box>
          ) : null}
          <Gap y={8} />
          <FormValidationError disabled={disabled} errorText={displayError} />
        </Box>
      </ScrollView>
      <TermsBlock setPrivacyCheck={setPrivacyCheck} privacyCheck={privacyCheck} />
      <MainButton ml={32} mr={32} text={t('next')} disabled={!privacyCheck || disabled} onPress={submitHandler} />
      <FakeView />
      <AndroidOnlyGap height={16} />
    </Box>
  )
}
