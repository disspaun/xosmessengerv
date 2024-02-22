import { Icons } from '@assets'
import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { FormValidationError } from '@src/components/elements/formBody/FormValidationError'
import { CredentialsInput, CredentialsInputWithIcon } from '@src/components/fields/CredentialsInputWithIcon'
import { OptionsPickerWithIcon } from '@src/components/fields/OptionsPickerWithIcon'
import { MainButton } from '@src/components/pressable/MainButton'
import { SecondaryButton } from '@src/components/pressable/SecondaryButton'
import { TapePressable } from '@src/components/pressable/TapePressable'

import { useEffectExceptOnMount } from '@src/hooks/common/useRenderedOnce'
import { useAwareInputWithScroll } from '@src/hooks/useAwareInputWithScroll'
import { useBackHandlerPreventorWithRoute } from '@src/hooks/useBackHandlerPreventorWithRoute'
import { useForm } from '@src/hooks/useForm'
import { useHandleInputTaps } from '@src/hooks/useHandleInputTaps'
import { useProtectedValuePicker } from '@src/hooks/useProtectedValuePicker'
import { useModalContext } from '@src/providers/ModalProvider'
import { ScreenProps } from '@src/routing/NavigationTypes'
import { basicStyles } from '@src/theme/basicStyles'
import { Box } from '@src/theme/helpers/Box'
import { FakeView } from '@src/theme/helpers/FakeView'
import { Gap } from '@src/theme/helpers/Gap'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'
import { setupProfile } from '@src/ucore/hydrations'

export const SignInScreen = ({ navigation, route }: ScreenProps<'signIn'>) => {
  useBackHandlerPreventorWithRoute('signIn')

  const { t } = useTranslation()
  const { colors, insets } = useAppTheme()
  const scrollViewRef = useRef<ScrollView>(null)
  const { onLayout, onFocus, handleInputFocusedWithScrollview } = useAwareInputWithScroll(scrollViewRef, 16, 300)

  const inputsRef = useRef<Record<string, CredentialsInput | null>>({
    password: null,
  })

  useHandleInputTaps(inputsRef)

  const signUp = useCallback(() => {
    navigation.navigate('signUp')
  }, [navigation])

  const importAccount = useCallback(() => {
    navigation.navigate('importAccount')
  }, [])

  const { modalVisible } = useModalContext()

  const { openPicker, pickedValue } = useProtectedValuePicker()

  const { handleOnChange, submitHandler, disabled, errors, displayError } = useForm<'accountValue' | 'password'>({
    initialState: { accountValue: pickedValue, password: '' },
    validators: {
      accountValue: (value) => value.length < 3,
      password: (value) => value.length < 6,
    },
    onSubmit: async (values) => {
      const data = { name: values.accountValue, password: values.password }
      return await setupProfile(data)
    },
  })

  useEffectExceptOnMount(() => {
    handleOnChange('accountValue')(pickedValue)
  }, [pickedValue])

  return (
    <Box flex backgroundColor={colors.mainBackground}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onScroll={handleInputFocusedWithScrollview}
        bounces={false}
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        contentContainerStyle={[basicStyles.flexGrow, basicStyles.justifyContentCenter]}
      >
        <Box ml={32} mr={32}>
          <Gap y={32} />
          <Box alignSelf="center">
            <Icons.svg.ulogo width={188} height={124} fill={colors.iconColor} />
          </Box>
          <Gap y={24} />
          <Text type="body" numberOfLines={3} center>
            {t('introDescription')}
          </Text>
          <Gap y={24} />
          <OptionsPickerWithIcon
            visible={modalVisible}
            textValue={pickedValue}
            placeholder={t('selectAccount')}
            onPress={openPicker}
            error={errors.accountValue}
            leftIconName="user"
          />
          <Gap y={16} />
          <Box onLayout={onLayout(1)}>
            <CredentialsInputWithIcon
              error={errors.password}
              ref={(ref) => (inputsRef.current.password = ref)}
              onChange={handleOnChange('password')}
              placeholder={t('password')}
              leftIconName="password"
              onFocus={onFocus(1)}
              secure
            />
          </Box>
          <Gap y={8} />
          <FormValidationError disabled={disabled} errorText={displayError} />
        </Box>
      </ScrollView>
      <MainButton ml={32} mr={32} text={t('signIn')} onPress={submitHandler} disabled={disabled} />
      <Gap y={16} />
      <SecondaryButton onPress={signUp} ml={32} mr={32} text={t('createAccount')} />
      <Gap y={10} />
      <TapePressable ml={32} mr={32} onPress={importAccount}>
        <Text colorName="secondaryText" type="semiSecondaryUnderline">
          {t('logInExist')}
        </Text>
      </TapePressable>
      <Gap y={10} />
      <Box alignSelf="center">
        <Text colorName="secondaryText" type="semiSecondary">
          {'Utopia v. 0.0.1 ©2020. 1984 Group LP'}
        </Text>
      </Box>
      <FakeView />

      <Gap y={insets.bottom} />
    </Box>
  )
}
