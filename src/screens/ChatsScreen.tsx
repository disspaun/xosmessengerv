import { Icons } from '@assets'
import { memo, useCallback, useMemo } from 'react'
import { Platform, StatusBar, StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { ChatList } from '@src/components/chatList/ChatList'
import { AnchorMenu } from '@src/components/controls/AnchorMenu'
import { Header } from '@src/components/nav/Header'
import { TapePressable } from '@src/components/pressable/TapePressable'

import { useBackHandlerPreventorWithRoute } from '@src/hooks/useBackHandlerPreventorWithRoute'
import { useShareExtension } from '@src/hooks/useShareExtension'
import { useLocalization } from '@src/locales/localization'
import { ScreenProps } from '@src/routing/NavigationTypes'
import { Box } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'
import { useStyles } from '@src/theme/useStyles'

const getStyles = (theme: App.Theme) => {
  const styles = StyleSheet.create({
    content: {
      flex: 1,
    },
  })
  return styles
}

const HamburgerMenu = memo(({ openAddAccount, navigation }) => {
  const { colors, insets } = useAppTheme()

  const openContacts = useCallback(() => {
    navigation.navigate('contacts')
  }, [navigation])

  const topOffset = useMemo(
    () => Platform.select({ ios: insets.top + 8, default: (StatusBar.currentHeight || 0) + 8 }),
    [insets.top],
  )

  return (
    <AnchorMenu
      mt={6}
      mr={16}
      pl={4}
      pr={4}
      extraOffset={{ top: topOffset, left: 8 }}
      style={{ backgroundColor: colors.menuBackgroundColor }}
      menuRows={[
        { key: '1', leftIconName: 'add', label: 'addContact', onPress: openAddAccount },
        { key: '2', leftIconName: 'contactSingle', label: 'contacts', onPress: openContacts },
      ]}
      iconColor="iconColor"
      iconName="menu"
    />
  )
})

const Right = ({ navigation }) => {
  const { colors } = useAppTheme()

  const openAddAccount = useCallback(() => {
    navigation.navigate('addContact')
  }, [])
  return (
    <Box flex row justifyContent="flex-end">
      <TapePressable mr={4} pl={4} pr={4} onPress={() => {}}>
        <Icons.svg.search width={24} height={24} fill={colors.iconColor} />
      </TapePressable>
      <HamburgerMenu navigation={navigation} openAddAccount={openAddAccount} />
    </Box>
  )
}

export const HeaderLeftIndicator = ({ navigation }) => {
  return (
    <Box flex>
      <Box m={16} mt={10} mb={10} effect="none" onPress={() => {}}>
        <Icons.svg.network width={42} height={24} />
      </Box>
    </Box>
  )
}

export const ChatsScreen = ({ navigation }: ScreenProps<'chats'>) => {
  const { colors } = useAppTheme()
  const styles = useStyles(getStyles)
  const { t } = useLocalization()
  useShareExtension()

  useBackHandlerPreventorWithRoute('chats')

  return (
    <GestureHandlerRootView style={styles.content}>
      <Header
        title={t('chats')}
        right={<Right navigation={navigation} />}
        left={<HeaderLeftIndicator navigation={navigation} />}
        shadow
      />
      <Box backgroundColor={colors.backgroundColor} flex>
        <ChatList />
      </Box>
    </GestureHandlerRootView>
  )
}
