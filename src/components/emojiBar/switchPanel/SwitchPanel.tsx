import { Icons } from '@assets'
import React, { Fragment, memo, useCallback } from 'react'
import { Platform } from 'react-native'

import { clearInput } from '@src/components/controls/MessageInput'

import { Box } from '@src/theme/helpers/Box'
import { Divider } from '@src/theme/helpers/Divider'
import { useAppTheme } from '@src/theme/theme'

interface ISwitchPanel {
  displayStickers: boolean
  changeTab(value: boolean): () => void
}

export const SwitchPanel = memo(({ displayStickers, changeTab }: ISwitchPanel) => {
  const { colors, insets } = useAppTheme()

  const clearUpInput = useCallback(() => {
    clearInput()
  }, [])

  return (
    <Fragment>
      <Divider flex={undefined} />
      <Box
        mt={3}
        mb={3}
        backgroundColor={colors.mainBackground}
        row
        alignItems="center"
        justifyContent="center"
        w="screen"
      >
        <Box flex ml={16} />
        <Box
          alignSelf="flex-end"
          effect="opacity"
          borderRadius={4}
          backgroundColor={!displayStickers ? colors.bgTextButton : 'transparent'}
          onPress={changeTab(false)}
        >
          <Icons.svg.smile width={32} height={32} fill={colors.iconColor} />
        </Box>
        <Box
          alignSelf="flex-end"
          effect="opacity"
          borderRadius={4}
          backgroundColor={displayStickers ? colors.bgTextButton : 'transparent'}
          onPress={changeTab(true)}
        >
          <Icons.svg.sticker width={32} height={32} fill={colors.iconColor} />
        </Box>
        <Box flex mr={16}>
          <Box justifyContent="center" alignSelf="flex-end" effect="opacity" borderRadius={4} onPress={clearUpInput}>
            <Icons.svg.deleteSmile width={24} height={24} fill={colors.iconColor} />
          </Box>
        </Box>
      </Box>
      <Divider flex={undefined} mb={Platform.select({ ios: 16, default: insets.bottom })} />
    </Fragment>
  )
})
