import { Icons } from '@assets'
import { memo } from 'react'

import { MainButton } from '@src/components/pressable/MainButton'

import { useLocalization } from '@src/locales/localization'
import { Box, BoxProps } from '@src/theme/helpers/Box'
import { Gap } from '@src/theme/helpers/Gap'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'

interface IDocumentPermissionDenied {
  requestPermissions: () => void
}

export const CameraRollPermissionDenied = memo(
  ({ requestPermissions, ...boxProps }: IDocumentPermissionDenied & BoxProps) => {
    const { colors } = useAppTheme()
    const { t } = useLocalization()
    return (
      <Box {...boxProps} backgroundColor={colors.backgroundColor} flex justifyContent="center" alignItems="center">
        <Icons.svg.emptyImage fill={colors.inMessageBackgroundColor} width={150} height={150} />
        <Gap y={32} />
        <Text center type="secondary">
          {t('documentPermissionDenied')}
        </Text>
        <Gap y={32} />
        <MainButton text={t('showGallery')} onPress={requestPermissions} pl={36} pr={36} />
      </Box>
    )
  },
)
