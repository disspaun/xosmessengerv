import * as React from 'react'
import Svg, { ClipPath, Defs, G, SvgProps } from 'react-native-svg'

import { AnimatedPath } from '@src/components/svg/index'

import { MySVGProps } from '@src/mytypes'

const ChatsSvg = ({ animatedProps, ...props }: SvgProps & MySVGProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G fill="#666" clipPath="url(#a)">
      <AnimatedPath
        animatedProps={animatedProps}
        d="M.413 21.592C.03 21.928 0 22.167 0 23.128c0 .435.5.872.999.872h10.875c.024 0 .047 0 .07-.002a.856.856 0 0 0 .055.002h10.875C23.5 24 24 23.563 24 23.128c0-.961-.032-1.2-.41-1.536-.581-.55-1.976-1.089-3.246-1.346-.968-.268-1.422-.918-1.522-1.62 1.135-.874 1.928-2.725 1.928-4.144C20.75 12.56 19.294 11 17.5 11s-3.25 1.56-3.25 3.482c0 1.419.792 3.27 1.927 4.145-.1.7-.554 1.35-1.52 1.62-.947.19-1.962.538-2.657.93-.696-.392-1.71-.74-2.656-.93-.968-.27-1.422-.92-1.522-1.62 1.135-.875 1.928-2.726 1.928-4.145C9.75 12.56 8.294 11 6.5 11s-3.25 1.56-3.25 3.482c0 1.419.792 3.27 1.927 4.145-.1.7-.554 1.35-1.52 1.62-1.273.256-2.666.796-3.244 1.345Z"
      />
      <AnimatedPath
        animatedProps={animatedProps}
        fillRule="evenodd"
        d="M6 7V1c0-.5.5-1 1-1h10c.5 0 .999.5 1 1v6c0 .5-.5 1-1 1.001L14 8l-2 3-2-2.999H7C6.5 8 6 7.5 6 7Zm3-5h6v1H9V2Zm4 2H9v1h4V4Z"
        clipRule="evenodd"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <AnimatedPath fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default ChatsSvg
