import * as React from 'react'
import Svg, { SvgProps } from 'react-native-svg'

import { AnimatedPath } from '@src/components/svg/index'

import { MySVGProps } from '@src/mytypes'

const ProfileSvg = ({ animatedProps, ...props }: SvgProps & MySVGProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <AnimatedPath
      animatedProps={animatedProps}
      d="M.699 17.924c-.646.569-.699.974-.699 2.6C0 21.261.847 22 1.69 22h14.393a5.989 5.989 0 0 1 2.165-5.682 18.674 18.674 0 0 0-2.436-.67c-1.637-.455-2.405-1.555-2.575-2.741 1.921-1.48 3.263-4.613 3.263-7.015C16.5 2.64 14.036 0 11 0S5.5 2.64 5.5 5.892c0 2.402 1.34 5.535 3.261 7.015-.17 1.186-.938 2.286-2.573 2.74-2.153.435-4.51 1.348-5.49 2.277Z"
    />
  </Svg>
)
export default ProfileSvg
