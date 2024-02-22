import { StatusUser } from '../../tm/Types'
import { Icons } from '@assets'
import { useCallback, useState } from 'react'
import { Platform, ScrollView, View } from 'react-native'
import { resetGenericPassword } from 'react-native-keychain'

import { OnlineStatus } from '@src/components/elements/indicators/OnlineStatus'
import { ExternalOptionPickerWithIcon } from '@src/components/fields/ExternalOptionPickerWithIcon'
import { LabeledFieldWithAction } from '@src/components/fields/LabeledFieldWithAction'
import { OptionWithSwitch } from '@src/components/fields/OptionWithSwitch'
import { Header } from '@src/components/nav/Header'

import { useEffectExceptOnMount } from '@src/hooks/common/useRenderedOnce'
import { useAppAlert } from '@src/hooks/useAppAlert'
import { useCustomAsyncStorage, useParsedStorage } from '@src/hooks/useAsyncStorage'
import { useAutoAuthorizationSwitch } from '@src/hooks/useAutoAuthorizationSwitch'
import { useBackHandlerPreventorWithRoute } from '@src/hooks/useBackHandlerPreventorWithRoute'
import { useCopyToClipboard } from '@src/hooks/useCopyToClipboard'
import { useOnPagePicker } from '@src/hooks/useOnPagePicker'
import { LocalizationKeys, useLocalization } from '@src/locales/localization'
import { useProfileProvider } from '@src/providers/ProfileProvider'
import { ScreenProps } from '@src/routing/NavigationTypes'
import { HeaderLeftIndicator } from '@src/screens/ChatsScreen'
import { basicStyles } from '@src/theme/basicStyles'
import { Box } from '@src/theme/helpers/Box'
import { Divider } from '@src/theme/helpers/Divider'
import { Gap } from '@src/theme/helpers/Gap'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'
import { clearProfile, modifyProfile } from '@src/ucore/actions'

export const ProfileScreen = ({ navigation }: ScreenProps<'profile'>) => {
  const { colors, insets, dark } = useAppTheme()
  const { t } = useLocalization()
  const [, , clearCredentials] = useParsedStorage('@credentials/object')
  const [appThemeKey, setAppThemeKey] = useCustomAsyncStorage('@appTheme/string')
  const { profile, publicKey } = useProfileProvider()
  const [notificationsEnabled, setNotificationsEnabled] = useState(profile?.pushEnabled)

  const { isAutoAuthorization, onAutoAuthorizationSwitch } = useAutoAuthorizationSwitch()
  const { copyToClipboard } = useCopyToClipboard()
  useBackHandlerPreventorWithRoute('profile')

  const copyText = useCallback((localeKey?: LocalizationKeys) => (text: string) => copyToClipboard(text, localeKey), [])

  const signOut = useCallback(async () => {
    const isResetSuccessful = await resetGenericPassword()
    if (isResetSuccessful) {
      clearProfile()
      clearCredentials().catch(() => {})
    }
  }, [])

  const editNickname = useCallback(() => {
    navigation.navigate('singleField', {
      title: t('editNickname'),
      description: t('editNicknameDesc'),
      icon: 'user',
      value: profile?.nickname || '',
      action: (value: string) => {
        modifyProfile({ nickname: value })
      },
    })
  }, [profile?.nickname])

  const updateNotificationsStatus = (value: boolean) => {
    modifyProfile({ pushEnabled: value })
    setNotificationsEnabled(value)
  }

  const { showAlert: showLogOutAlert } = useAppAlert({
    title: t('signOut'),
    description: t('signOutQuestion'),
    actions: [{ text: t('cancel') }, { text: t('ok').toUpperCase(), onPress: signOut }],
  })

  const { showAlert: showNotificationsAlert } = useAppAlert({
    descTextProps: { center: undefined },
    title: t('enablePushNotifications'),
    description: t('enablePushNotificationsDesc'),
    actions: [
      {
        text: t('cancel'),
        onPress: () => {
          updateNotificationsStatus(false)
        },
      },
      { text: t('ok').toUpperCase() },
    ],
  })

  const handleNotificationsSwitch = useCallback(
    (value: boolean) => {
      updateNotificationsStatus(value)
      if (value) {
        showNotificationsAlert()
      }
    },
    [showNotificationsAlert],
  )

  const {
    openPicker: openThemePicker,
    pickedValue: themeValue,
    setPickedValue: setThemeValue,
  } = useOnPagePicker<string>(
    [
      { icon: 'sync', text: t('systemTheme'), value: 'system' },
      { icon: 'darkTheme', text: t('darkTheme'), value: 'dark' },
      { icon: 'lightTheme', text: t('lightTheme'), value: 'light' },
    ],
    appThemeKey || 'system',
  )

  const {
    openPicker: openStatusPicker,
    pickedValue: statusValue,
    setPickedValue: setStatusValue,
  } = useOnPagePicker<number>(
    [
      {
        leftComponent: <OnlineStatus status={StatusUser.Available} size={12} m={10} alignSelf="center" />,
        text: t(StatusUser[StatusUser.Available]),
        value: StatusUser.Available,
      },
      {
        leftComponent: <OnlineStatus status={StatusUser.Away} size={12} m={10} alignSelf="center" />,
        text: t(StatusUser[StatusUser.Away]),
        value: StatusUser.Away,
      },
      {
        leftComponent: <OnlineStatus status={StatusUser.DoNotDisturb} size={12} m={10} alignSelf="center" />,
        text: t(StatusUser[StatusUser.DoNotDisturb]),
        value: StatusUser.DoNotDisturb,
      },
      {
        leftComponent: <OnlineStatus status={StatusUser.Invisible} size={12} m={10} alignSelf="center" />,
        text: t(StatusUser[StatusUser.Invisible]),
        value: StatusUser.Invisible,
      },
      {
        leftComponent: <OnlineStatus status={StatusUser.Offline} size={12} m={10} alignSelf="center" />,
        text: t(StatusUser[StatusUser.Offline]),
        value: StatusUser.Offline,
      },
    ],
    profile?.status,
  )

  useEffectExceptOnMount(() => {
    if (!profile?.status) {
      return
    }
    setStatusValue(profile.status)
  }, [profile?.status])

  useEffectExceptOnMount(() => {
    if (!statusValue) {
      return
    }
    modifyProfile({ status: statusValue })
  }, [statusValue])

  useEffectExceptOnMount(() => {
    if (!appThemeKey) {
      return
    }
    setThemeValue(appThemeKey)
  }, [appThemeKey])

  useEffectExceptOnMount(() => {
    if (!themeValue) {
      return
    }
    setAppThemeKey(themeValue).catch(() => {})
  }, [themeValue])

  return (
    <View style={basicStyles.flex}>
      <Header title={t('profile')} left={<HeaderLeftIndicator navigation={navigation} />} shadow />
      <Box flex backgroundColor={colors.backgroundColor}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Box mb={24} alignSelf="center" alignItems="center">
            <Box mt={32} mb={16} alignSelf="center">
              <Icons.svg.avatar
                width={80}
                height={80}
                fill={dark ? colors.inMessageBackgroundColor : colors.disabledButtonColor}
              />
            </Box>
            <Text weight="medium" type="body">
              {profile?.nickname || ''}
            </Text>
          </Box>
          <LabeledFieldWithAction
            value={profile?.nickname || ''}
            action={editNickname}
            label={t('nickname')}
            leftIconName="userOption"
            rightIconName="pencil"
            pl={16}
            pr={16}
          />
          <Gap y={6} />
          <LabeledFieldWithAction
            value={publicKey}
            action={copyText('publicProfileCopied')}
            label={t('publicKey')}
            leftIconName="publickey"
            rightIconName="copy"
            pl={16}
            pr={16}
          />
          <Gap y={6} />
          <LabeledFieldWithAction
            value={`https://utopia.im/${publicKey}`}
            action={copyToClipboard}
            label={t('deepLink')}
            leftIconName="int"
            rightIconName="copy"
            pl={16}
            pr={16}
          />
          <Gap y={7} />
          <Divider ml={16} mr={16} />
          <ExternalOptionPickerWithIcon
            text={t('status')}
            onPress={openStatusPicker}
            leftIconName="status"
            pl={16}
            pr={16}
          >
            <Box alignSelf="center" row>
              <OnlineStatus status={statusValue || StatusUser.Available} size={12} mr={10} alignSelf="center" />
              <Text type="body" colorName="secondaryText">
                {t(StatusUser[statusValue || StatusUser.Available])}
              </Text>
            </Box>
          </ExternalOptionPickerWithIcon>
          <ExternalOptionPickerWithIcon text={t('ucode')} onPress={() => {}} leftIconName="ucode" pl={16} pr={16} />
          <OptionWithSwitch
            mt={4}
            leftIconName="notifications"
            text={t('notifications')}
            value={notificationsEnabled}
            onSwitch={handleNotificationsSwitch}
            pl={16}
            pr={16}
          />
          <OptionWithSwitch
            mt={4}
            leftIconName="autoAuthorization"
            text={t('authorizationOption')}
            value={isAutoAuthorization}
            onSwitch={onAutoAuthorizationSwitch}
            pl={16}
            pr={16}
          />
          <ExternalOptionPickerWithIcon
            text={`${t('backup')} ${t('publicKey')}`}
            onPress={() => {}}
            leftIconName="publickey"
            pl={16}
            pr={16}
          />
          <ExternalOptionPickerWithIcon
            text={t('theme')}
            onPress={openThemePicker}
            leftIconName="colortheme"
            pl={16}
            pr={16}
          >
            <Box alignSelf="center" row>
              <Text type="body" colorName="secondaryText">
                {t(themeValue)}
              </Text>
            </Box>
          </ExternalOptionPickerWithIcon>
          <ExternalOptionPickerWithIcon
            text={t('agreeTerms')}
            onPress={() => {}}
            leftIconName="viewDetails"
            pl={16}
            pr={16}
          />
          <Divider ml={16} mr={16} />
          <ExternalOptionPickerWithIcon
            text={t('signOut')}
            onPress={showLogOutAlert}
            leftIconName="signout"
            pl={16}
            pr={16}
          />
          <Text center colorName="secondaryText" type="semiSecondary">
            {'Utopia v. 0.0.1 ©2020. 1984 Group LP'}
          </Text>
          <Gap y={insets.bottom + Platform.select({ ios: 16, default: 54 })} />

          {/*<ExternalOptionPickerWithIcon*/}
          {/*  text={t('security')}*/}
          {/*  onPress={() => {*/}
          {/*    navigation.navigate('security')*/}
          {/*  }}*/}
          {/*  leftIconName="channelStatus"*/}
          {/*  pl={16}*/}
          {/*  pr={16}*/}
          {/*>*/}
          {/*  <Box alignSelf="center" row>*/}
          {/*    <Text type="body" colorName="secondaryText">*/}
          {/*      {t('normal')}*/}
          {/*    </Text>*/}
          {/*  </Box>*/}
          {/*</ExternalOptionPickerWithIcon>*/}
          {/*<ExternalOptionPickerWithIcon*/}
          {/*  text={t('blacklist')}*/}
          {/*  onPress={() => {}}*/}
          {/*  leftIconName="banUser"*/}
          {/*  pl={16}*/}
          {/*  pr={16}*/}
          {/*/>*/}
          {/*<ExternalOptionPickerWithIcon*/}
          {/*  text={t('downloadMediaOption')}*/}
          {/*  onPress={() => {*/}
          {/*    navigation.navigate('mediaSettings')*/}
          {/*  }}*/}
          {/*  leftIconName="inbox"*/}
          {/*  pl={16}*/}
          {/*  pr={16}*/}
          {/*/>*/}

          {/*<ExternalOptionPickerWithIcon*/}
          {/*  text={t('exportDatabaseOption')}*/}
          {/*  onPress={() => {}}*/}
          {/*  leftIconName="save"*/}
          {/*  pl={16}*/}
          {/*  pr={16}*/}
          {/*/>*/}
          {/*<ExternalOptionPickerWithIcon text={t('devices')} onPress={() => {}} leftIconName="devices" pl={16} pr={16} />*/}
        </ScrollView>
      </Box>
    </View>
  )
}
