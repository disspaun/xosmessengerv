import { Box, BoxProps } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'

interface IChatDateSection {
  title: string
  isHidden?: boolean
  dividerLineMargin?: number
}
export const ChatDateSection = ({ title, isHidden, dividerLineMargin, ...boxProps }: IChatDateSection & BoxProps) => {
  const { colors } = useAppTheme()
  return (
    <Box row key={title} {...boxProps}>
      <Box
        height={0.5}
        alignSelf="center"
        flex
        backgroundColor={isHidden ? undefined : colors.dividerColor}
        mr={8}
        ml={dividerLineMargin}
      />
      <Text type="tiny" colorName="secondaryText" weight="semibold">
        {isHidden ? '' : title}
      </Text>
      <Box
        height={0.5}
        alignSelf="center"
        flex
        backgroundColor={isHidden ? undefined : colors.dividerColor}
        ml={8}
        mr={dividerLineMargin}
      />
    </Box>
  )
}
