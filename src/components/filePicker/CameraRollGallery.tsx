import { Album } from '@react-native-camera-roll/camera-roll'
import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll/src/CameraRoll'
import { memo, useCallback, useState } from 'react'
import { FlatList } from 'react-native'

import { CameraRollGalleryItem, ICameraRollGalleryItem } from '@src/components/filePicker/CameraRollGalleryItem'

import { useGallery } from '@src/hooks/useGallery'
import { TakePhotoAsset } from '@src/hooks/useTakeFile'
import { Box } from '@src/theme/helpers/Box'
import { Gap } from '@src/theme/helpers/Gap'

interface ICameraRoll {
  currentAlbum: Album | null
  handleAsset: (asset: TakePhotoAsset) => Promise<void>
}

export const CameraRollGallery = memo(({ currentAlbum, handleAsset }: ICameraRoll) => {
  const { photos, loadNextPagePictures, isLoading, isLoadingNextPage, isReloading, hasNextPage } = useGallery({
    album: currentAlbum,
    pageSize: 18,
  })
  const [_pickedItem, _setPickedItem] = useState('')

  const onEndReached = useCallback(() => {
    if (isReloading || isLoading || isLoadingNextPage) {
      return
    }
    if (!hasNextPage) {
      return
    }
    loadNextPagePictures()
  }, [isLoadingNextPage, isReloading, isLoading, hasNextPage, loadNextPagePictures])

  const onPickItem = useCallback(
    (item: PhotoIdentifier['node']['image']) => () => {
      _setPickedItem((prev) => {
        if (prev === item.uri) {
          void handleAsset(null)
          return ''
        }
        void handleAsset({
          type: item.extension || '',
          fileName: item.filename || '',
          ...item,
          fileSize: item.fileSize || 0,
        })
        return item.uri
      })
    },
    [],
  )

  const renderItem = useCallback(
    ({ item }: ICameraRollGalleryItem) => {
      const isPicked = item.uri === _pickedItem
      return <CameraRollGalleryItem isPicked={isPicked} handleAsset={onPickItem} item={item} />
    },
    [_pickedItem],
  )

  return (
    <Box flex>
      <FlatList
        keyExtractor={(item) => item.uri}
        numColumns={3}
        data={photos}
        onEndReached={onEndReached}
        ListFooterComponent={<Gap y={72} />}
        onEndReachedThreshold={0.5}
        renderItem={renderItem}
      />
    </Box>
  )
})
