import { Icons } from '@assets'
import { useCallback } from 'react'
import { StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { ContactList } from '@src/components/contactList/ContactList'
import { Header } from '@src/components/nav/Header'
import { TapePressable } from '@src/components/pressable/TapePressable'

import { useLocalization } from '@src/locales/localization'
import { ScreenProps } from '@src/routing/NavigationTypes'
import { LeftBack } from '@src/screens/ChatScreen'
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

const Right = ({ navigation }) => {
  const { colors } = useAppTheme()

  const openAddAccount = useCallback(() => {
    navigation.navigate('addContact')
  }, [])
  return (
    <TapePressable alignSelf="flex-end" mr={16} ml={16} pl={4} pr={4} onPress={openAddAccount}>
      <Icons.svg.add width={24} height={24} fill={colors.iconColor} />
    </TapePressable>
  )
}

export const ContactsScreen = ({ navigation }: ScreenProps<'contacts'>) => {
  const { colors } = useAppTheme()
  const styles = useStyles(getStyles)
  const { t } = useLocalization()

  return (
    <GestureHandlerRootView style={styles.content}>
      <Header
        title={t('contacts')}
        right={
          <Box justifyContent="center" flex>
            <Right navigation={navigation} />
          </Box>
        }
        left={
          <Box justifyContent="center" flex>
            <LeftBack alignSelf="flex-start" navigation={navigation} />
          </Box>
        }
        shadow
      />
      <Box backgroundColor={colors.backgroundColor} flex>
        <ContactList />
      </Box>
    </GestureHandlerRootView>
  )
}
