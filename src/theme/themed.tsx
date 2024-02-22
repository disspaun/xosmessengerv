import { FC, ForwardedRef, PropsWithChildren, forwardRef, memo, useMemo } from 'react'
import {
  // eslint-disable-next-line no-restricted-imports
  Text as DefaultText,
  View as DefaultView,
  ViewProps as DefaultViewProps,
  FlexStyle,
  Pressable,
  StyleProp,
  TextStyle,
  TouchableHighlight,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native'
import { TouchableOpacity as TouchableOpacityGH } from 'react-native-gesture-handler'
import { TouchableRipple } from 'react-native-paper'
import { TextPropsAndroid } from 'react-native/Libraries/Text/Text'

import { TouchableScale } from '@src/components/pressable/TouchableScale'

import { AvailableColors } from '@src/mytypes'
import { isIOS } from '@src/utils/isIOS'

import { fontStyles } from './text'
import { useAppTheme } from './theme'

type colorKeys = keyof ReturnType<typeof useAppTheme>['colors']

type ThemeProps = {
  lightColorName?: colorKeys
  darkColorName?: colorKeys
  colorName?: colorKeys
}

type TextTypes = keyof typeof fontStyles

const boldStyles = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const

type TextTransform =
  | { uppercase?: true; lowercase?: void; capitalize?: void }
  | { uppercase?: void; lowercase?: true; capitalize?: void }
  | { uppercase?: void; lowercase?: void; capitalize?: true }

type TextAlign =
  | { left?: true; center?: void; right?: void }
  | { left?: void; center?: true; right?: void }
  | { left?: void; center?: void; right?: true }

type MyTextProps = {
  type?: TextTypes
  weight?: keyof typeof boldStyles
  flex?: number | true
  lineHeight?: number
  android_hyphenationfrequency: TextPropsAndroid['android_hyphenationFrequency']
}

type MyViewProps = {
  relative?: true
  absolute?: true
  onPress?: () => void
  effect?: 'opacity' | 'scale' | 'none' | 'highlight' | 'ripple' | 'gestureHandler'
}

export type TextProps = ThemeProps & Omit<DefaultText['props'], 'children'> & MyTextProps & TextTransform & TextAlign
type ViewProps = ThemeProps & DefaultView['props'] & MyViewProps

export type ThemedTextType = PropsWithChildren<TextProps>

export type Text = DefaultText
export const Text = memo(forwardRef(Text1))
function Text1(
  {
    style,
    type = 'body',
    weight = 'regular',
    uppercase,
    lowercase,
    capitalize,
    left,
    right,
    center,
    colorName,
    lightColorName,
    darkColorName,
    children,
    lineHeight,
    paperColor,
    flexShrink,
    flex,
    ...otherProps
  }: PropsWithChildren<TextProps> & {
    paperColor?: string
    flexShrink?: FlexStyle['flexShrink']
  },
  ref: ForwardedRef<DefaultText>,
) {
  const theme = useAppTheme()
  const key = colorName || (theme.dark ? darkColorName : lightColorName) || 'primaryTextColor'

  const styles: StyleProp<TextStyle> = useMemo(() => {
    const textTransform = uppercase ? 'uppercase' : lowercase ? 'lowercase' : capitalize ? 'capitalize' : undefined
    const textAlign = left ? 'left' : right ? 'right' : center ? 'center' : undefined

    return [
      fontStyles[type],
      {
        flexShrink,
        color: paperColor || theme.colors[key],
        fontWeight: boldStyles[weight],
        textTransform,
        textAlign,
        lineHeight,
        flex: flex === true ? 1 : flex,
      },
      style,
    ]
  }, [
    uppercase,
    lowercase,
    capitalize,
    left,
    right,
    center,
    type,
    theme.colors,
    key,
    weight,
    flex,
    style,
    lineHeight,
    paperColor,
    flexShrink,
  ])

  return (
    <DefaultText ref={ref} style={styles} {...otherProps}>
      {children}
    </DefaultText>
  )
}

export type View = DefaultView
export const View = forwardRef(ViewWithRef)
function ViewWithRef(
  props: ViewProps & {
    onPress?: TouchableOpacityProps['onPress']
    onLongPress?: TouchableOpacityProps['onLongPress']
    rippleColor?: AvailableColors
  },
  ref: ForwardedRef<DefaultView>,
) {
  const {
    style,
    relative,
    absolute,
    onPress,
    effect,
    colorName,
    lightColorName,
    darkColorName,
    onLongPress,
    rippleColor,
    ...otherProps
  } = props
  const theme = useAppTheme()
  const key = colorName || (theme.dark ? darkColorName : lightColorName)

  const styles = useMemo(
    () => [
      {
        backgroundColor: key && theme.colors[key],
        position: relative ? 'relative' : absolute ? 'absolute' : undefined,
      } as const,
      style,
    ],
    [key, theme.colors, relative, absolute, style],
  )

  const Component = useMemo(() => {
    if (onLongPress || onPress) {
      switch (effect) {
        case 'none':
          return Pressable
        case 'scale':
          return TouchableScale
        case 'ripple':
          return TouchableRipple
        case 'highlight':
          return TouchableHighlight
        case 'gestureHandler':
          return TouchableOpacityGH
        default:
          return TouchableOpacity
      }
    }
    return DefaultView as unknown as FC<DefaultViewProps>
  }, [effect, onPress, onLongPress])

  return (
    <Component
      ref={ref}
      style={styles}
      onPress={onPress}
      onLongPress={onLongPress}
      rippleColor={isIOS ? undefined : rippleColor}
      {...otherProps}
    />
  )
}
