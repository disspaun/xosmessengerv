import LottieView from 'lottie-react-native'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Header } from '@src/components/nav/Header'

import { useParsedStorage } from '@src/hooks/useAsyncStorage'
import { ScreenProps } from '@src/routing/NavigationTypes'
import { AndroidOnlyGap } from '@src/theme/helpers/AndroidOnlyGap'
import { Box } from '@src/theme/helpers/Box'
import { Gap } from '@src/theme/helpers/Gap'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'

export const ProcessingScreen = ({ navigation, route }: ScreenProps<'processing' | 'startup'>) => {
  const { t } = useTranslation()
  const { colors, insets, dark } = useAppTheme()
  const [, setCredentials] = useParsedStorage('@credentials/object')
  useEffect(() => {
    if (route.params?.name) {
      setTimeout(() => {
        // @ts-ignore
        setCredentials({ name: route.params.name }).catch(() => {})
      }, 1500)
    }
  }, [])

  const animationSrc = dark ? require('@assets/lottie/startup-dark.json') : require('@assets/lottie/startup-light.json')

  return (
    <Box flex backgroundColor={colors.mainBackground}>
      <Header title={t(route.params?.textKey || 'importingAccount')} />
      <Box flex justifyContent="center" alignItems="center">
        <LottieView style={{ width: 241, height: 211 }} source={animationSrc} autoPlay loop />
      </Box>
      <Box mr={32} ml={32} justifyContent="center" alignItems="center">
        <Text center>{t('creatingContainerDesc')}</Text>
        <Text>{''}</Text>
        <Text>{t('pleaseWait')}</Text>
      </Box>
      <Gap y={(insets.bottom || 0) + 12} />
      <AndroidOnlyGap height={32} />
    </Box>
  )
}
