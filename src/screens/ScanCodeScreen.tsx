import { useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Camera, useCameraDevice } from 'react-native-vision-camera'

import { MainButton } from '@src/components/pressable/MainButton'
import { SecondaryButton } from '@src/components/pressable/SecondaryButton'

import { useLocalization } from '@src/locales/localization'
import { ScreenProps } from '@src/routing/NavigationTypes'
import { basicStyles } from '@src/theme/basicStyles'
import { Box } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraView: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  maskOutter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 3,
  },
  maskInner: {
    width: 300,
    backgroundColor: 'transparent',
  },
  maskFrame: {
    backgroundColor: 'rgba(1,1,1,0.6)',
  },
  maskRow: {
    width: '100%',
  },
  maskCenter: { flexDirection: 'row' },
  glUpperLeft: {
    top: -11,
    left: 89,
    borderStyle: 'solid',
    position: 'absolute',
    zIndex: 100,
    width: 75,
    height: 75,
    borderWidth: 4,
    borderBottomWidth: 0,
    borderBottomEndRadius: 4,

    // borderBottomLeftRadius: 4,
    borderRightWidth: 0,
    overflow: 'hidden',
    borderColor: '#FFF',
  },
  glUpperRight: {
    top: -11,
    right: 89,
    borderStyle: 'solid',
    position: 'absolute',
    zIndex: 100,
    width: 75,
    height: 75,
    borderWidth: 4,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    overflow: 'hidden',
    borderColor: '#FFF',
  },
  glBottomLeft: {
    bottom: -11,
    left: 89,
    borderStyle: 'solid',
    position: 'absolute',
    zIndex: 100,
    width: 75,
    height: 75,
    borderWidth: 4,
    borderTopWidth: 0,
    borderRightWidth: 0,
    overflow: 'hidden',
    borderColor: '#FFF',
  },
  glBottomRight: {
    bottom: -11,
    right: 89,
    borderStyle: 'solid',
    position: 'absolute',
    zIndex: 100,
    width: 75,
    height: 75,
    borderWidth: 4,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    overflow: 'hidden',
    borderColor: '#FFF',
  },
  frameWidth: {
    width: 100,
  },
})

export const ScanCodeScreen = ({ navigation, route }: ScreenProps<'scanCode'>) => {
  const device = useCameraDevice('back')
  const { insets } = useAppTheme()
  const { t } = useLocalization()

  const requestPermission = useCallback(async () => {
    try {
      const cameraPermission = await Camera.requestCameraPermission()
      if (cameraPermission !== 'granted') {
        navigation.goBack()
      }
    } catch (e) {
      navigation.goBack()
    }
  }, [])

  useEffect(() => {
    void requestPermission()
  }, [])

  if (device == null) return <Box flex />
  return (
    <Box flex>
      <Camera style={StyleSheet.absoluteFill} device={device} isActive={true}>
        <View style={styles.maskOutter}>
          <View style={[basicStyles.flex, styles.maskRow, styles.maskFrame]} />
          <View style={[basicStyles.flex, styles.maskCenter]}>
            <View style={[styles.frameWidth, styles.maskFrame]} />
            <View style={styles.maskInner} />
            <View key="gl1" style={styles.glUpperLeft} />
            <View key="gl2" style={styles.glUpperRight} />
            <View key="gl3" style={styles.glBottomLeft} />
            <View key="gl4" style={styles.glBottomRight} />
            <View style={[styles.frameWidth, styles.maskFrame]} />
          </View>
          <View style={[basicStyles.flex, styles.maskRow, styles.maskFrame]} />
        </View>
      </Camera>
      <Box absolute bottom={0} w="screen" pl={32} pr={32}>
        <MainButton text={t('scan')} mb={16} onPress={navigation.goBack} />
        <SecondaryButton mb={insets.bottom} text={t('importFromFile')} onPress={navigation.goBack} />
      </Box>
    </Box>
  )
}
