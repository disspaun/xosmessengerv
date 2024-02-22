import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { Snackbar, SnackbarProps } from 'react-native-paper'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'

import { useReanimatedKeyboardAnimationHeight } from '@src/providers/SystemProvider'
import { useAppTheme } from '@src/theme/theme'

export interface ISnackBarParams {
  text: string
  action?: SnackbarProps['action']
}

export interface ISnackBarProviderContextProps {
  setSnackBarVisible: Dispatch<SetStateAction<boolean>>
  setupSnackBar: (snackBarData: ISnackBarParams) => void
  snackBarVisible: boolean
}

const SnackBarContext = createContext<ISnackBarProviderContextProps>({
  setupSnackBar: () => {},
  setSnackBarVisible: () => {},
  snackBarVisible: false,
})

interface ISnackBarProviderProps {
  children: ReactNode
}

export const SnackBarProvider: FC<ISnackBarProviderProps> = ({ children }) => {
  const [snackBarVisible, setSnackBarVisible] = useState(false)
  const { colors } = useAppTheme()
  const height = useReanimatedKeyboardAnimationHeight()

  const translateY = useAnimatedStyle(
    () => ({
      transform: [{ translateY: -Math.abs(height.value) - 24 }],
    }),
    [],
  )

  const [snackBar, setSnackBar] = useState<ISnackBarParams>({
    action: undefined,
    text: '',
  })
  const setupSnackBar = useCallback((snackBarData: ISnackBarParams) => {
    setSnackBar(snackBarData)
  }, [])
  const onDismissSnackBar = useCallback(() => {
    setSnackBarVisible(false)
  }, [])

  const action = useMemo(
    () => (snackBar.action ? { textColor: colors.buttonColor, ...snackBar.action } : undefined),
    [snackBar.action, colors.buttonColor],
  )
  return (
    <SnackBarContext.Provider value={{ setSnackBarVisible, setupSnackBar, snackBarVisible }}>
      {children}
      {snackBarVisible ? (
        height.value ? (
          <Animated.View style={translateY}>
            <Snackbar duration={2000} visible onDismiss={onDismissSnackBar} action={action}>
              {snackBar.text}
            </Snackbar>
          </Animated.View>
        ) : (
          <Snackbar
            wrapperStyle={{ zIndex: 100, bottom: 60 }}
            duration={2000}
            visible
            onDismiss={onDismissSnackBar}
            action={action}
          >
            {snackBar.text}
          </Snackbar>
        )
      ) : null}
    </SnackBarContext.Provider>
  )
}

export const useSnackBarContext = () => useContext(SnackBarContext)
