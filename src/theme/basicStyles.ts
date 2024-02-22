import { StyleSheet } from 'react-native'

import { fontStyles } from '@src/theme/text'

export const basicStyles = StyleSheet.create({
  absolute: {
    position: 'absolute',
  },
  screenHorizontal: {
    paddingHorizontal: 16,
  },
  screenHorizontalInverted: {
    marginHorizontal: -16,
  },
  cover: {
    zIndex: 1,
  },
  flex: {
    flex: 1,
  },
  flexGrow: {
    flexGrow: 1,
  },
  fullSize: {
    width: '100%',
    height: '100%',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  buttonText: {
    ...fontStyles.body,
    fontWeight: '600',
    textAlign: 'center',
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  overflowHidden: {
    overflow: 'hidden',
  },
  mainTitleText: {
    fontFamily: 'DrukTextWide-Super',
    fontSize: 34,
    lineHeight: 41,
    letterSpacing: 0.37,
    fontWeight: '600',
  },
} as const)
