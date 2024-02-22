import { Icons } from '@assets'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { CredentialsInput, CredentialsInputWithIcon } from '@src/components/fields/CredentialsInputWithIcon'
import { Header } from '@src/components/nav/Header'
import { TapePressable } from '@src/components/pressable/TapePressable'

import { ScreenProps } from '@src/routing/NavigationTypes'
import { LeftBack } from '@src/screens/ChatScreen'
import { Box } from '@src/theme/helpers/Box'
import { Gap } from '@src/theme/helpers/Gap'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'

export const RightSign = ({ navigation, onPress, alignSelf }) => {
  const { colors } = useAppTheme()

  return (
    <TapePressable mr={16} ml={16} pl={4} pr={4} alignSelf={alignSelf} onPress={onPress}>
      <Icons.svg.ok width={24} height={24} fill={colors.iconColor} />
    </TapePressable>
  )
}

export const SingleFieldScreen = ({ navigation, route }: ScreenProps<'singleField'>) => {
  const { colors } = useAppTheme()
  const { t } = useTranslation()
  const inputRef = useRef<CredentialsInput>(null)

  const saveAndQuit = () => {
    route.params.action(inputRef.current?.value || '')
    navigation.goBack()
  }

  return (
    <>
      <Header
        title={route.params.title}
        left={
          <Box justifyContent="center" flex>
            <LeftBack alignSelf="flex-start" navigation={navigation} />
          </Box>
        }
        right={
          <Box justifyContent="center" flex>
            <RightSign alignSelf="flex-end" navigation={navigation} onPress={saveAndQuit} />
          </Box>
        }
      />
      <Box backgroundColor={colors.mainBackground} flex pt={24} pl={32} pr={32}>
        <CredentialsInputWithIcon
          placeholder={t('nickname')}
          leftIconName="user"
          ref={inputRef}
          initialValue={route.params.value}
        />
        <Gap y={24} />
        <Text>{route.params.description}</Text>
      </Box>
    </>
  )
}
