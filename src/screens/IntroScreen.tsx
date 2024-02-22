import { Icons } from '@assets'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { MainButton } from '@src/components/pressable/MainButton'
import { TapePressable } from '@src/components/pressable/TapePressable'

import { useBackHandlerPreventorWithRoute } from '@src/hooks/useBackHandlerPreventorWithRoute'
import { ScreenProps } from '@src/routing/NavigationTypes'
import { Box } from '@src/theme/helpers/Box'
import { Gap } from '@src/theme/helpers/Gap'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'

export const IntroScreen = ({ navigation, route }: ScreenProps<'intro'>) => {
  const { t } = useTranslation()
  const { colors, insets } = useAppTheme()
  useBackHandlerPreventorWithRoute('intro')

  const signUp = useCallback(() => {
    navigation.navigate('signUp')
  }, [navigation])

  const importAccount = useCallback(() => {
    navigation.navigate('importAccount')
  }, [])

  return (
    <Box flex backgroundColor={colors.mainBackground}>
      <Box flex justifyContent="center" alignItems="center">
        <Icons.svg.ulogo width={188} height={124} fill={colors.iconColor} />
        <Gap y={32} />
        <Text type="body" numberOfLines={3} center>
          {t('introDescription')}
        </Text>
      </Box>
      <MainButton ml={32} mr={32} text={t('signUp')} onPress={signUp} />
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

      <Gap y={insets.bottom} />
    </Box>
  )
}
