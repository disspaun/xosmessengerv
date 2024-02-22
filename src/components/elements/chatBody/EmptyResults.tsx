import { Icons } from '@assets'
import { ReactNode } from 'react'
import { StyleSheet } from 'react-native'

import { Box } from '@src/theme/helpers/Box'
import { useAppTheme } from '@src/theme/theme'

const styles = StyleSheet.create({
  container: { transform: [{ rotate: '180deg' }] },
})

export const EmptyResults = ({ children }: { children?: ReactNode }) => {
  const { colors } = useAppTheme()
  return (
    <Box flex alignItems="center" justifyContent="center" style={styles.container}>
      <Icons.svg.emptyChat width={200} height={200} fill={colors.inMessageBackgroundColor} />
      <Box absolute>{children}</Box>
    </Box>
  )
}
