import { StyleSheet } from 'react-native'

const fontFamily = undefined

export const fontStyles = StyleSheet.create({
  body: {
    //styleName: Body/Regular,
    fontFamily,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
  },
  secondary: {
    //styleName: Body/Bold,
    fontFamily,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '400',
  },
  secondaryUnderline: {
    ...this?.secondary,
    textDecorationLine: 'underline',
  },
  semiSecondary: {
    //styleName: Body/Bold,
    fontFamily,
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '400',
  },
  semiSecondaryUnderline: {
    ...this?.semiSecondary,
    textDecorationLine: 'underline',
  },
  tiny: {
    //styleName: Body/Bold,
    fontFamily,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '400',
  },
} as const)
