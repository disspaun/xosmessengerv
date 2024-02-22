import { Icons } from '@assets'
import { useNavigation } from '@react-navigation/native'
import { Dispatch, SetStateAction, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BackHandler, Dimensions, Platform, StatusBar, StyleSheet, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import Share from 'react-native-share'
import { NativeEventSubscription } from 'react-native/Libraries/EventEmitter/RCTNativeAppEventEmitter'

import { AnchorMenu } from '@src/components/controls/AnchorMenu'
import { PinchToZoom } from '@src/components/layout/PinchToZoom'
import { controlSystemLayoutsColors } from '@src/components/layout/SplashScreen'
import { Header } from '@src/components/nav/Header'
import { TapePressable } from '@src/components/pressable/TapePressable'

import { Chat } from '@src/database/models'
import usePrevious from '@src/hooks/common/usePrevious'
import { LeftBack } from '@src/screens/ChatScreen'
import { Box } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'
import { useSavePicture } from '@src/utils/cameraRoll'
import { isIOS } from '@src/utils/isIOS'
import { createAtFormatChatShort } from '@src/utils/time'

export let setImageViewerVisible: Dispatch<SetStateAction<boolean>> | undefined
export let setImageViewerContact: Dispatch<SetStateAction<Contact>> | undefined
export let setImageViewerImagePath: Dispatch<SetStateAction<string>> | undefined

type Contact = Partial<Chat> & { timestamp: number }

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: '#00000099',
    zIndex: 3,
    position: 'absolute',
  },
})

const HamburgerMenu = memo(({ onShare, onSave }) => {
  const { colors, insets } = useAppTheme()

  const topOffset = useMemo(
    () => Platform.select({ ios: insets.top + 8, default: (StatusBar.currentHeight || 0) + 8 }),
    [insets.top],
  )

  return (
    <Box flex row justifyContent="flex-end">
      <TapePressable rippleColor={colors.white} mr={4} pl={4} pr={4} onPress={onShare}>
        <Icons.svg.share width={24} height={24} fill={colors.white} />
      </TapePressable>

      <AnchorMenu
        rippleColor={colors.white}
        mt={6}
        mr={16}
        ml={8}
        pl={4}
        pr={4}
        extraOffset={{ top: topOffset, left: 8 }}
        style={{ backgroundColor: colors.black }}
        menuRows={[
          {
            key: '1',
            leftIconName: 'save',
            label: 'save',
            onPress: onSave,
            backgroundColor: 'black',
            contentColor: 'white',
          },
        ]}
        iconColor="white"
        iconName="menu"
      />
    </Box>
  )
})

const Center = ({ navigation, chat }) => {
  const { colors } = useAppTheme()
  return (
    <Box row flex>
      <Box>
        <Box mt={4}>
          <Text colorName="white" lineHeight={21}>
            {chat.name}
          </Text>
        </Box>
        <Box mb={4}>
          <Text colorName="white" type="tiny">
            {createAtFormatChatShort(Number(chat.timestamp))}
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export const ImageViewer = () => {
  const [isVisible, setIsVisible] = useState(false)
  const prevIsVisible = usePrevious(isVisible)
  const [image, setImage] = useState<string>('')
  const [contact, setContact] = useState<Contact | {}>({})
  const navigation = useNavigation()
  const { colors, dark } = useAppTheme()
  const backHandlerRef = useRef<NativeEventSubscription | null>(null)

  const resetAndroidSystemLayouts = useCallback(() => {
    controlSystemLayoutsColors(colors.mainBackground, dark)
    backHandlerRef.current?.remove()
  }, [dark, colors])

  const onRequestClose = useCallback(() => {
    setIsVisible(false)
    return true
  }, [])

  useEffect(() => {
    if (!isIOS) {
      if (isVisible) {
        controlSystemLayoutsColors(colors.black, true)
        backHandlerRef.current = BackHandler.addEventListener('hardwareBackPress', onRequestClose)
      } else if (prevIsVisible) {
        resetAndroidSystemLayouts()
      }
      return resetAndroidSystemLayouts
    }
  }, [isVisible])

  const { savePicture } = useSavePicture({ type: 'photo', successMessage: 'savedInDownloads' })

  const onSave = useCallback(() => {
    if (!image) {
      return
    }
    void savePicture(image)
  }, [image])

  const onShare = useCallback(async () => {
    Share.open({
      url: image,
      excludedActivityTypes: [
        'default',
        'com.utopiamessengertest',
        'com.utopiamessengertest.ShareMenu',
        'org.reactjs.native.example.utopiaMessengerTest.ShareExtension',
        'org.reactjs.native.example.utopiaMessengerTest',
        'utopiaMessengerTest',
        'utopiatest',
        'com.apple.share-services',
        'com.meedan',
      ],
    })
      .then(() => {})
      .catch(() => {})
  }, [image])

  const renderHeader = useMemo(
    () => (
      <Header
        right={<HamburgerMenu onShare={onShare} onSave={onSave} />}
        center={<Center navigation={navigation} chat={contact} />}
        left={
          <Box justifyContent="center">
            <LeftBack onBack={onRequestClose} iconColor={colors.white} alignSelf="flex-start" navigation={navigation} />
          </Box>
        }
        shadow
        backgroundColor={colors.fullScreenBg}
      />
    ),
    [contact, onShare],
  )

  useEffect(() => {
    setImageViewerVisible = setIsVisible
    setImageViewerImagePath = setImage
    setImageViewerContact = setContact
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <View style={styles.container}>
      {renderHeader}
      <Box flex backgroundColor={colors.black} justifyContent="center" alignItems="center">
        <GestureHandlerRootView>
          <PinchToZoom>
            <Animated.Image
              style={{ width: Dimensions.get('screen').width, height: null, flex: 1, resizeMode: 'contain' }}
              source={{ uri: image }}
            />
          </PinchToZoom>
        </GestureHandlerRootView>
      </Box>
    </View>
  )
}
