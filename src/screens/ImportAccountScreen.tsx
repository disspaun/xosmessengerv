import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { Header } from '@src/components/nav/Header'
import { MainButton } from '@src/components/pressable/MainButton'

import { ScreenProps } from '@src/routing/NavigationTypes'
import { LeftBack } from '@src/screens/ChatScreen'
import { AndroidOnlyGap } from '@src/theme/helpers/AndroidOnlyGap'
import { Box } from '@src/theme/helpers/Box'
import { Gap } from '@src/theme/helpers/Gap'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'

export const ImportAccountScreen = ({ navigation, route }: ScreenProps<'importAccount'>) => {
  const { colors, insets } = useAppTheme()
  const { t } = useTranslation()

  const goToForm = useCallback(() => {
    navigation.navigate('importAccountForm')
  }, [])

  return (
    <Box backgroundColor={colors.mainBackground} flex pb={insets.bottom}>
      <Header
        title={t('importUtopiaAccount')}
        left={
          <Box justifyContent="center" flex>
            <LeftBack alignSelf="flex-start" navigation={navigation} />
          </Box>
        }
      />
      <Box flex pt={24} pl={32} pr={32}>
        <Gap y={24} />
        <Text>{t('importUtopiaAccountDesc')}</Text>
        <Gap y={24} />
      </Box>
      <MainButton ml={32} mr={32} text={t('next')} onPress={goToForm} />
      <AndroidOnlyGap height={16} />
    </Box>
  )
}
