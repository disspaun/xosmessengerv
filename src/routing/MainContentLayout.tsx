import { ReactNode } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { ImageViewer } from '@src/components/layout/ImageViewer'
import { SplashScreen } from '@src/components/layout/SplashScreen'

import { AsyncStorageParsedValue, Credentials } from '@src/mytypes'
import { ModalProvider } from '@src/providers/ModalProvider'
import { SnackBarProvider } from '@src/providers/SnackBarProvider'
import { RootStack } from '@src/routing/stacks/RootStack'
import { UnauthorizedStack } from '@src/routing/stacks/UnauthorizedStack'
import { useStyles } from '@src/theme/useStyles'

const getStyles = (theme: App.Theme) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
    },
  })
  return styles
}

export const MainContentLayout = ({
  children,
  displaySplashScreen,
  credentials,
}: {
  displaySplashScreen: boolean
  credentials: AsyncStorageParsedValue<Credentials>
  children?: ReactNode
}) => {
  const styles = useStyles(getStyles)
  return (
    <SafeAreaProvider style={styles.container}>
      {displaySplashScreen ? (
        <SplashScreen />
      ) : (
        <SnackBarProvider>
          <ModalProvider>{credentials ? <RootStack credentials={credentials} /> : <UnauthorizedStack />}</ModalProvider>
          <ImageViewer />
        </SnackBarProvider>
      )}
    </SafeAreaProvider>
  )
}
