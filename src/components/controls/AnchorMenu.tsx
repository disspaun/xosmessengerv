import { Icons } from '@assets'
import { ReactNode, cloneElement, memo, useCallback, useEffect, useRef, useState } from 'react'
import { InteractionManager, StyleSheet, View, ViewStyle } from 'react-native'

import { PaperMenuRow } from '@src/components/fields/PaperMenuRow'
import { Menu, Position } from '@src/components/layout/Menu'
import { TapePressable } from '@src/components/pressable/TapePressable'

import { dismissInputPanel } from '@src/hooks/useKeyboard'
import { LocalizationKeys, useLocalization } from '@src/locales/localization'
import { AvailableColorNames, AvailableIcons } from '@src/mytypes'
import { useSystemKeyboardProvider } from '@src/providers/SystemProvider'
import { BoxProps } from '@src/theme/helpers/Box'
import { Divider } from '@src/theme/helpers/Divider'
import { useAppTheme } from '@src/theme/theme'

export interface IAnchorMenu {
  menuRows: (
    | {
        key: string
        leftIconName: AvailableIcons
        label: LocalizationKeys
        labelText?: string
        onPress?: () => void
        backgroundColor?: AvailableColorNames
        contentColor?: AvailableColorNames
      }
    | string
  )[]
  iconColor?: AvailableColorNames
  iconName?: AvailableIcons
  style?: ViewStyle
  extraOffset?: { top?: number; left?: number }
  component?: ReactNode
}

const styles = StyleSheet.create({
  menuRow: {
    minWidth: 180,
  },
})

export const AnchorMenu = memo(
  ({ menuRows, style, iconName, extraOffset, iconColor, component, ...boxProps }: IAnchorMenu & BoxProps) => {
    const buttonRef = useRef(null)
    const menuRef = useRef<Menu>(null)
    const { t } = useLocalization()
    const { colors } = useAppTheme()
    const { keyboardShown } = useSystemKeyboardProvider()
    const [_visible, _setIsVisible] = useState(false)

    const hideMenu = useCallback(() => {
      _setIsVisible(false)
      menuRef.current?.hide()
    }, [])
    const showMenu = useCallback(() => {
      dismissInputPanel()
      _setIsVisible(true)
    }, [])

    const handleOnHidden = useCallback(() => {
      _setIsVisible(false)
    }, [])

    useEffect(() => {
      if (!keyboardShown && _visible) {
        InteractionManager.runAfterInteractions(() => {
          setTimeout(() => {
            menuRef.current?.show(buttonRef.current, Position.BOTTOM_CENTER_TOP_ADJUST, { top: 5 })
          }, 100)
        })
        _setIsVisible(false)
      }
    }, [keyboardShown, _visible])

    const handleCallbackThenHide = useCallback(
      (callback?: () => void) => () => {
        hideMenu()
        InteractionManager.runAfterInteractions(() => {
          callback?.()
        })
      },
      [],
    )

    const Icon = Icons.svg[iconName || 'menu']

    return (
      <>
        <View ref={buttonRef}>
          {component ? (
            cloneElement(component, { onPress: showMenu })
          ) : (
            <TapePressable {...boxProps} onPress={showMenu}>
              <Icon width={24} height={24} fill={iconColor ? colors[iconColor] : undefined} />
            </TapePressable>
          )}
        </View>
        <Menu extraOffset={extraOffset} onHidden={handleOnHidden} style={style} ref={menuRef}>
          {menuRows.map((item) => {
            if (typeof item === 'string') {
              return <Divider key={item} ml={16} mr={16} />
            }
            return (
              <PaperMenuRow
                key={item.key}
                leftIconName={item.leftIconName}
                text={item.labelText ? item.labelText : t(item.label)}
                onPress={handleCallbackThenHide(item.onPress)}
                contentColor={item.contentColor}
                backgroundColor={item.backgroundColor}
                style={styles.menuRow}
              />
            )
          })}
        </Menu>
      </>
    )
  },
)
