import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StyleSheet } from 'react-native'

import ChatsSvg from '@src/components/svg/Chats'
import ProfileSvg from '@src/components/svg/Profile'

import { useLocalization } from '@src/locales/localization'
import { TabsParamList } from '@src/routing/NavigationTypes'
import { TabPart } from '@src/routing/TabPart'
import { HomeStack } from '@src/routing/stacks/HomeStack'
import { ProfileStack } from '@src/routing/stacks/ProfileStack'
import { basicStyles } from '@src/theme/basicStyles'
import { useAppTheme } from '@src/theme/theme'
import { useStyles } from '@src/theme/useStyles'

const Tab = createBottomTabNavigator<TabsParamList>()

const getStyles = (theme: App.Theme) => {
  const styles = StyleSheet.create({
    tabBarStyle: {
      shadowColor: theme.colors.backdrop,
      shadowOffset: { width: 0, height: 0.4 },
      shadowOpacity: 0.5,
      borderTopWidth: 0,
      overflow: 'hidden',
    },
  })
  return styles
}

export const Tabs = () => {
  const { colors } = useAppTheme()
  const { t } = useLocalization()
  const styles = useStyles(getStyles)
  return (
    <Tab.Navigator
      initialRouteName="chatsTab"
      detachInactiveScreens={false}
      screenOptions={{
        headerShown: false,
        tabBarStyle: [basicStyles.absolute, styles.tabBarStyle, { backgroundColor: colors.mainBackground }],
        tabBarActiveTintColor: colors.iconHLcolor,
        tabBarInactiveTintColor: colors.unselectedTabIconColor,
        tabBarBadgeStyle: {
          backgroundColor: colors.mainBackground,
        },
      }}
    >
      <Tab.Screen
        key={1}
        name="chatsTab"
        component={HomeStack}
        options={{
          tabBarButton: (props) => <TabPart icon={ChatsSvg} label={t('messages')} {...props} />,
        }}
      />
      <Tab.Screen
        key={2}
        name="profileTab"
        component={ProfileStack}
        options={{
          tabBarButton: (props) => <TabPart icon={ProfileSvg} label={t('profile')} status {...props} />,
        }}
      />
    </Tab.Navigator>
  )
}
