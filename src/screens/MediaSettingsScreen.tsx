import { useTranslation } from 'react-i18next'

import { LabeledSliderWithValue } from '@src/components/fields/LabeledSliderWithValue'
import { OptionWithSwitch } from '@src/components/fields/OptionWithSwitch'
import { Header } from '@src/components/nav/Header'

import { ScreenProps } from '@src/routing/NavigationTypes'
import { LeftBack } from '@src/screens/ChatScreen'
import { RightSign } from '@src/screens/SingleFieldScreen'
import { Box } from '@src/theme/helpers/Box'
import { Gap } from '@src/theme/helpers/Gap'
import { useAppTheme } from '@src/theme/theme'

export const MediaSettingsScreen = ({ navigation }: ScreenProps<'mediaSettings'>) => {
  const { colors } = useAppTheme()
  const { t } = useTranslation()
  return (
    <>
      <Header
        title={t('createAccount')}
        left={
          <Box justifyContent="center" flex>
            <LeftBack alignSelf="flex-start" navigation={navigation} />
          </Box>
        }
        right={
          <Box justifyContent="center" flex>
            <RightSign alignSelf="flex-end" navigation={navigation} onPress={navigation.goBack} />
          </Box>
        }
      />
      <Box backgroundColor={colors.mainBackground} flex pt={24} pl={32} pr={32}>
        <OptionWithSwitch text={t('autoReceiveFiles')} value={false} onSwitch={() => {}} />
        <Gap y={24} />
        <LabeledSliderWithValue
          onChange={(e) => {}}
          text={t('maxFileSize')}
          postfix={t('mb')}
          min={1}
          max={100}
          value={10}
        />
      </Box>
    </>
  )
}
