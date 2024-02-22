import { memo } from 'react'

import { Box } from '@src/theme/helpers/Box'
import { Text } from '@src/theme/themed'

const SectionHeader = ({ name }: { name: string }) => {
  return (
    <Box mb={6} mt={6}>
      <Text type="tiny" colorName="secondaryText">
        {name}
      </Text>
    </Box>
  )
}

export default memo(SectionHeader)
