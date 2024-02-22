import { memo } from 'react'
import { StyleSheet } from 'react-native'

import { RoundButtonWithIconTransition } from '@src/components/pressable/RoundButtonWithIconTransition'

import { useLocalization } from '@src/locales/localization'
import { Box } from '@src/theme/helpers/Box'
import { Gap } from '@src/theme/helpers/Gap'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'
import { useStyles } from '@src/theme/useStyles'
import { isIOS } from '@src/utils/isIOS'

const getStyles = (theme: App.Theme) => {
  const styles = StyleSheet.create({
    container: isIOS
      ? {
          shadowColor: theme.colors.backdrop,
          shadowOffset: { width: 0, height: 0.4 },
          shadowOpacity: 0.5,
          borderTopWidth: 0,
          overflow: 'hidden',
        }
      : { elevation: 12 },
  })
  return styles
}

interface IDocumentTypeControls {
  withCamera: () => void
  withGallery: () => void
  messageInputLayoutHeight: number
}

export const DocumentTypeControls = memo(
  ({ withCamera, withGallery, messageInputLayoutHeight }: IDocumentTypeControls) => {
    const { colors, insets } = useAppTheme()
    const styles = useStyles(getStyles)

    const { t } = useLocalization()

    return (
      <Box
        w="full"
        absolute
        bottom={-messageInputLayoutHeight}
        zIndex={3}
        p={16}
        pb={8}
        pt={8}
        row
        justifyContent="space-around"
        backgroundColor={colors.backgroundColor}
        style={styles.container}
      >
        <Box justifyContent="center" alignItems="center">
          <RoundButtonWithIconTransition
            onPress={withGallery}
            fillColorDefault={colors.linkColor}
            fillColorHL={colors.white}
            backgroundColor={colors.fileAttachBackground}
            rippleColor="#0063B1"
            icon="fileAttach"
          />
          <Gap y={4} />
          <Text type="tiny" weight="medium" colorName="secondaryText">
            {t('file')}
          </Text>
        </Box>
        <Box justifyContent="center" alignItems="center">
          <RoundButtonWithIconTransition
            onPress={() => {}}
            fillColorDefault="#C5921D"
            fillColorHL={colors.white}
            backgroundColor={colors.contactShareBackground}
            rippleColor="#C4921D"
            icon="contacts"
          />

          <Gap y={4} />
          <Text type="tiny" weight="medium" colorName="secondaryText">
            {t('contact')}
          </Text>
        </Box>
        <Box justifyContent="center" alignItems="center">
          <RoundButtonWithIconTransition
            onPress={withCamera}
            fillColorDefault="#CA5A5A"
            fillColorHL={colors.white}
            backgroundColor={colors.withCameraBackground}
            rippleColor="#CA5A5A"
            icon="camera"
          />
          <Gap y={4} />
          <Text type="tiny" weight="medium" colorName="secondaryText">
            {t('camera')}
          </Text>
        </Box>
      </Box>
    )
  },
)
