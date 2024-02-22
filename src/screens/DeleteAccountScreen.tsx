import { useTranslation } from 'react-i18next'

import { Header } from '@src/components/nav/Header'
import { MainButton } from '@src/components/pressable/MainButton'

import { useAppAlert } from '@src/hooks/useAppAlert'
import { ScreenProps } from '@src/routing/NavigationTypes'
import { LeftBack } from '@src/screens/ChatScreen'
import { AndroidOnlyGap } from '@src/theme/helpers/AndroidOnlyGap'
import { Box } from '@src/theme/helpers/Box'
import { Gap } from '@src/theme/helpers/Gap'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'
import { removeProfile } from '@src/ucore/actions'

export const DeleteAccountScreen = ({ navigation, route }: ScreenProps<'deleteAccount'>) => {
  const { colors, insets } = useAppTheme()
  const { t } = useTranslation()

  const { showAlert: deleteAccountAlert } = useAppAlert({
    title: t('deleteAccount'),
    description: t('deleteAccountQuestion'),
    actions: [
      { text: t('cancel') },
      {
        text: t('ok'),
        onPress: () => {
          removeProfile(route.params.name)
          navigation.goBack()
        },
      },
    ],
  })

  return (
    <Box backgroundColor={colors.mainBackground} flex pb={insets.bottom}>
      <Header
        title={t('deleteAccount')}
        left={
          <Box justifyContent="center" flex>
            <LeftBack alignSelf="flex-start" navigation={navigation} />
          </Box>
        }
      />
      <Box flex pt={24} pl={32} pr={32}>
        <Gap y={24} />
        <Text>{t('deleteAccountDesc')}</Text>
        <Gap y={24} />
      </Box>
      <MainButton
        ml={32}
        mr={32}
        buttonColor={colors.swipeRightColor}
        rippleColor={colors.swipeRightHLColor}
        text={t('deleteAccount')}
        onPress={deleteAccountAlert}
      />
      <AndroidOnlyGap height={16} />
    </Box>
  )
}
