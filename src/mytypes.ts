import { Icons } from '@assets'
import { FC } from 'react'
import { AnimatedProps } from 'react-native-reanimated/lib/typescript/reanimated2/helperTypes'
import { SvgProps } from 'react-native-svg'

import { darkColors, lightColors } from '@src/theme/colors'

export type MySVGProps = { fillPrimary?: string; fill?: string; animatedProps?: AnimatedProps<{ fill: string }> }

export type SVGComponent = FC<SvgProps & MySVGProps>

export type AvailableIcons = keyof (typeof Icons)['svg']

export type AvailableColors = ValueOf<typeof lightColors> | ValueOf<typeof darkColors>
export type AvailableColorNames = keyof typeof lightColors

export type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>

export type ValueOf<T> = T[keyof T]

export type Credentials = { name: string }

export type AsyncStorageValue = string | null | undefined
export type AsyncStorageParsedValue<T> = T | null | undefined
