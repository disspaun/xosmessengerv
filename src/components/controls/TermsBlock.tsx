import { Dispatch, SetStateAction } from 'react'

import { CheckBox } from '@src/components/fields/CheckBox'

import { useLocalization } from '@src/locales/localization'
import { Box } from '@src/theme/helpers/Box'
import { Gap } from '@src/theme/helpers/Gap'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'

interface ITermsBlock {
  setPrivacyCheck: Dispatch<SetStateAction<boolean>>
  privacyCheck: boolean
}

export const TermsBlock = ({ setPrivacyCheck, privacyCheck }: ITermsBlock) => {
  const { dark } = useAppTheme()
  const { t } = useLocalization()
  return (
    <Box row pl={32} pr={32} mb={24} pt={12} backgroundColor="transparent" alignItems="center">
      <CheckBox
        onCheck={setPrivacyCheck}
        value={privacyCheck}
        icon="checkbox"
        defaultIcon={dark ? 'emptyCheckboxDark' : 'emptyCheckboxLight'}
      />
      <Gap x={12} />
      <Text type="secondary">{t('terms')}</Text>
      <Gap x={4} />
      <Box onPress={() => {}}>
        <Text colorName="linkColor" type="secondaryUnderline">
          {t('agreeTerms')}
        </Text>
      </Box>
    </Box>
  )
}
