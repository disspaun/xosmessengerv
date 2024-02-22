import { memo } from 'react'
import { Image, useWindowDimensions } from 'react-native'

import { TakePhotoAsset } from '@src/hooks/useTakeFile'
import { Box } from '@src/theme/helpers/Box'
import { Text } from '@src/theme/themed'

interface IDocumentPreview {
  file: TakePhotoAsset
}

export const DocumentPreview = memo(({ file }: IDocumentPreview) => {
  const dimensions = useWindowDimensions()
  const isImage = file.width || file.height
  return (
    <Box flex alignItems="center" justifyContent="center">
      {isImage ? (
        <Image width={dimensions.width} height={dimensions.height} resizeMode="contain" source={{ uri: file.uri }} />
      ) : (
        <Box mr={16} ml={16}>
          <Text>{file.fileName}</Text>
        </Box>
      )}
    </Box>
  )
})
