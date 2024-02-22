import { Album, CameraRoll, cameraRollEventEmitter } from '@react-native-camera-roll/camera-roll'
import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll/src/CameraRoll'
import { useCallback, useEffect, useState } from 'react'
import { AppState, EmitterSubscription } from 'react-native'

import { isIOSAbove14 } from '@src/utils/platform'

interface GalleryOptions {
  album: Album | null
  pageSize?: number
  mimeTypeFilter?: Array<string>
}

interface GalleryLogic {
  photos?: PhotoIdentifier['node']['image'][]
  loadNextPagePictures: () => void
  isLoading: boolean
  isLoadingNextPage: boolean
  isReloading: boolean
  hasNextPage: boolean
}

const supportedMimeTypesByTheBackEnd = [
  'image/jpeg',
  'image/png',
  'image/heif',
  'image/heic',
  'image/heif-sequence',
  'image/heic-sequence',
]

export const convertCameraRollPicturesToImageDtoType = (edges: Array<PhotoIdentifier>) => {
  return edges.map((item) => item.node.image)
}

export const useGallery = ({
  pageSize = 30,
  mimeTypeFilter = supportedMimeTypesByTheBackEnd,
  album,
}: GalleryOptions): GalleryLogic => {
  const [isLoading, setIsLoading] = useState(false)
  const [isReloading, setIsReloading] = useState(false)
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [nextCursor, setNextCursor] = useState<string>()
  const [photos, setPhotos] = useState<PhotoIdentifier['node']['image'][]>([])

  const loadNextPagePictures = useCallback(async () => {
    try {
      nextCursor ? setIsLoadingNextPage(true) : setIsLoading(true)
      const { edges, page_info } = await CameraRoll.getPhotos({
        first: pageSize,
        after: nextCursor,
        assetType: 'Photos',
        mimeTypes: mimeTypeFilter,
        groupTypes: 'Album',
        ...(album && { groupName: album.title }),
        include: ['filename', 'fileSize', 'fileExtension', 'imageSize'],
      })
      const photos = convertCameraRollPicturesToImageDtoType(edges)
      setPhotos((prev) => [...(prev ?? []), ...photos])

      setNextCursor(page_info.end_cursor)
      setHasNextPage(page_info.has_next_page)
    } catch (error) {
      console.error('useGallery getPhotos error:', error)
    } finally {
      setIsLoading(false)
      setIsLoadingNextPage(false)
    }
  }, [mimeTypeFilter, nextCursor, pageSize, album])

  const getUnloadedPictures = useCallback(async () => {
    try {
      setIsReloading(true)
      const { edges, page_info } = await CameraRoll.getPhotos({
        first: !photos || photos.length < pageSize ? pageSize : photos.length,
        assetType: 'Photos',
        mimeTypes: mimeTypeFilter,
        groupTypes: 'Album',
        ...(album && { groupName: album.title }),
        // Include fileSize only for android since it's causing performance issues on IOS.
        include: ['filename', 'fileSize', 'fileExtension', 'imageSize'],
      })
      const newPhotos = convertCameraRollPicturesToImageDtoType(edges)
      setPhotos(newPhotos)

      setNextCursor(page_info.end_cursor)
      setHasNextPage(page_info.has_next_page)
    } catch (error) {
      console.error('useGallery getNewPhotos error:', error)
    } finally {
      setIsReloading(false)
    }
  }, [mimeTypeFilter, pageSize, photos, album])

  useEffect(() => {
    void getUnloadedPictures()
  }, [album])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
        getUnloadedPictures().catch(() => {})
      }
    })

    return () => {
      subscription.remove()
    }
  }, [getUnloadedPictures])

  useEffect(() => {
    let subscription: EmitterSubscription
    if (isIOSAbove14) {
      subscription = cameraRollEventEmitter.addListener('onLibrarySelectionChange', (_event) => {
        void getUnloadedPictures()
      })
    }

    return () => {
      if (isIOSAbove14 && subscription) {
        subscription.remove()
      }
    }
  }, [getUnloadedPictures])

  return {
    photos,
    loadNextPagePictures,
    isLoading,
    isLoadingNextPage,
    isReloading,
    hasNextPage,
  }
}
