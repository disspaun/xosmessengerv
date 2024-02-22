import { ComponentProps, forwardRef, useMemo } from 'react'
import { Dimensions, StyleSheet, ViewStyle } from 'react-native'

import { View } from '@src/theme/themed'

const dimensions = Dimensions.get('screen')

type Spacing = number

type BoxSpacers = Pick<
  ViewStyle,
  | 'justifyContent'
  | 'alignItems'
  | 'top'
  | 'left'
  | 'right'
  | 'bottom'
  | 'alignSelf'
  | 'borderWidth'
  | 'borderColor'
  | 'borderRadius'
  | 'zIndex'
  | 'overflow'
  | 'minWidth'
  | 'minHeight'
  | 'maxWidth'
  | 'maxHeight'
  | 'flexWrap'
  | 'flexGrow'
  | 'flexShrink'
  | 'flexBasis'
  | 'gap'
  | 'backgroundColor'
> & {
  h?: number | 'auto' | 'full' | 'screen'
  w?: number | 'auto' | 'full' | 'screen'
  m?: Spacing
  mx?: Spacing
  my?: Spacing
  mt?: Spacing
  mr?: Spacing
  mb?: Spacing
  ml?: Spacing
  p?: Spacing
  px?: Spacing
  py?: Spacing
  pt?: Spacing
  pr?: Spacing
  pb?: Spacing
  pl?: Spacing
  xGap?: Spacing
  yGap?: Spacing
  row?: boolean
  flex?: true | number
}

const getStyles = (spacers: BoxSpacers) => {
  const styles = StyleSheet.create({
    root: {
      margin: spacers.m,
      marginHorizontal: spacers.mx,
      marginVertical: spacers.my,
      marginTop: spacers.mt,
      marginRight: spacers.mr,
      marginBottom: spacers.mb,
      marginLeft: spacers.ml,
      padding: spacers.p,
      paddingHorizontal: spacers.px,
      paddingVertical: spacers.py,
      paddingTop: spacers.pt,
      paddingRight: spacers.pr,
      paddingBottom: spacers.pb,
      paddingLeft: spacers.pl,
      columnGap: spacers.xGap,
      rowGap: spacers.yGap,
      width: spacers.w === 'screen' ? dimensions.width : spacers.w === 'full' ? '100%' : spacers.w,
      height: spacers.h === 'screen' ? dimensions.height : spacers.h === 'full' ? '100%' : spacers.h,
      flexDirection: spacers.row ? 'row' : undefined,
      ...spacers,
      flex: spacers.flex ? 1 : spacers.flex,
    },
  })

  return styles
}

function divideSpacers<T extends BoxSpacers>(spacers: T): { spacers: BoxSpacers; rest: Omit<T, keyof BoxSpacers> } {
  const {
    h,
    w,
    m,
    mx,
    my,
    mt,
    mr,
    mb,
    ml,
    p,
    px,
    py,
    pt,
    pr,
    pb,
    pl,
    xGap,
    yGap,
    row,
    flex,
    justifyContent,
    alignItems,
    top,
    left,
    right,
    bottom,
    alignSelf,
    borderWidth,
    borderColor,
    borderRadius,
    zIndex,
    overflow,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    flexWrap,
    flexGrow,
    flexShrink,
    flexBasis,
    backgroundColor,
    gap,

    ...rest
  } = spacers
  return {
    spacers: {
      h,
      w,
      m,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
      p,
      px,
      py,
      pt,
      pr,
      pb,
      pl,
      xGap,
      yGap,
      row,
      flex,
      justifyContent,
      alignItems,
      top,
      left,
      right,
      bottom,
      alignSelf,
      borderWidth,
      borderColor,
      borderRadius,
      zIndex,
      overflow,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      flexWrap,
      flexGrow,
      flexShrink,
      flexBasis,
      backgroundColor,
      gap,
    },
    rest,
  }
}

export const useBox = (spacers: Readonly<BoxSpacers>) => {
  const styles = useMemo(
    () => getStyles(spacers),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [spacers],
    // __DEV__ ? undefined : [appThemeKey],
  )
  return styles.root
}

export interface BoxProps extends Readonly<BoxSpacers>, ComponentProps<typeof View> {
  activeOpacity?: number
  underlayColor?: string
  height?: number | string
  disabled?: boolean
  rippleColor?: string
  display?: ViewStyle['display']
}

export type Box = View
export const Box = forwardRef<View, BoxProps>(({ style, children, ...props }, ref) => {
  const { spacers, rest } = divideSpacers(props)

  const boxStyles = useBox(spacers)

  return (
    <View ref={ref} style={[boxStyles, style]} {...rest}>
      {children}
    </View>
  )
})
