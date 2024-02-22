import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LabeledRadioButtonOption } from '@src/components/fields/LabeledRadioButtonOption'
import { Header } from '@src/components/nav/Header'

import { ScreenProps } from '@src/routing/NavigationTypes'
import { LeftBack } from '@src/screens/ChatScreen'
import { RightSign } from '@src/screens/SingleFieldScreen'
import { Box } from '@src/theme/helpers/Box'
import { Gap } from '@src/theme/helpers/Gap'
import { useAppTheme } from '@src/theme/theme'

export const SecuritySettingsScreen = ({ navigation }: ScreenProps<'security'>) => {
  const [checked, setChecked] = useState('enhanced')
  const { colors } = useAppTheme()
  const { t } = useTranslation()
  return (
    <>
      <Header
        title={t('security')}
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
      <Box flex backgroundColor={colors.mainBackground} pt={24} pl={32} pr={32}>
        <LabeledRadioButtonOption
          label={t('normal')}
          checked={checked}
          description="2 peers"
          onChange={setChecked}
          value="normal"
        />
        <Gap y={24} />
        <LabeledRadioButtonOption
          label={t('enhancedPrivacy')}
          checked={checked}
          description="5 peers"
          onChange={setChecked}
          value="enhanced"
        />
        <Gap y={24} />
        <LabeledRadioButtonOption
          label={t('fullRouting')}
          checked={checked}
          description="10 peers and routing"
          onChange={setChecked}
          value="fullRouting"
        />
      </Box>
    </>
  )
}
