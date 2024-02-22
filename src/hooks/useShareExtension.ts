import { useNavigation } from '@react-navigation/native'
import { useCallback, useEffect } from 'react'
// @ts-ignore
import ShareMenu from 'rn-rnf-share-menu'

import { TakePhotoAsset } from '@src/hooks/useTakeFile'
import { checkAndProvideAssetFileCopy } from '@src/utils/file'

type SharedItem = {
  mimeType: string
  data: any
  extraData: any
}

export const useShareExtension = () => {
  const navigation = useNavigation()
  const handleShare = useCallback(async (share?: SharedItem) => {
    if (!share?.data || !share?.data?.length) {
      return
    }
    const { mimeType, data, extraData } = share
    console.log('init share: ', share)
    const file = await checkAndProvideAssetFileCopy({
      uri: data[0].data,
      mimeType: data[0].mimeType || mimeType,
      fileName: data[0].data.replace(/^.*[\\/]/, ''),
    } as TakePhotoAsset)
    if (file) {
      navigation.navigate('share', {
        fileName: file.fileName,
        uri: file.uri,
        mimeType: file.mimeType || '',
        text: extraData?.text || '',
      })
      return
    } else {
      throw new Error('file to share prepare error')
    }
  }, [])

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare)
  }, [handleShare])

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare)

    return listener.remove
  }, [handleShare])
}
