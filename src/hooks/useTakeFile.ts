/* eslint-disable react-native/split-platform-components */
import { useCallback } from 'react'
import { Platform } from 'react-native'
import DocumentPicker from 'react-native-document-picker'
import { DocumentPickerResponse } from 'react-native-document-picker/src/index'
import { Asset, launchCamera } from 'react-native-image-picker'
import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { Camera } from 'react-native-vision-camera'

import { checkAndProvideAssetFileCopy } from '@src/utils/file'

export type TakePhotoAsset = Asset & { uri: string; mimeType?: string }

const handleResults = async (result: ImagePickerResponse) => {
  if (result.assets?.[0]?.uri) {
    const file = await checkAndProvideAssetFileCopy(result.assets[0] as TakePhotoAsset)
    if (file) {
      return file as TakePhotoAsset
    } else {
      throw new Error('file prepare error: ' + result.errorMessage)
    }
  } else {
    throw new Error('take library error: ' + result.errorMessage)
  }
}

// @ts-ignore
const library = async (): Promise<{
  fileSize: DocumentPickerResponse['size']
  mimeType: DocumentPickerResponse['type']
  fileName: DocumentPickerResponse['name']
  uri: DocumentPickerResponse['fileCopyUri']
}> => {
  try {
    const result = await DocumentPicker.pickSingle({
      presentationStyle: 'fullScreen',
      copyTo: 'cachesDirectory',
    })
    if (result.fileCopyUri) {
      return {
        fileSize: result.size,
        mimeType: result.type,
        fileName: result.name,
        uri: result.fileCopyUri,
      }
    } else {
      throw new Error('document prepare error: ' + JSON.stringify(result.copyError))
    }
  } catch (e) {
    throw new Error('take document error: ' + JSON.stringify(e))
  }
}

const camera = async (): Promise<TakePhotoAsset | null> => {
  if (Platform.OS === 'android' && (await Camera.requestCameraPermission()) !== 'granted') {
    return null
  }
  const result = await launchCamera({
    mediaType: 'photo',
    cameraType: 'back',
    saveToPhotos: true,
    maxHeight: 1024,
    maxWidth: 1024,
    quality: 0.8,
  })
  return handleResults(result)
}

export function useTakeFile(onEnd: () => void) {
  return useCallback((index: number) => {
    return new Promise<TakePhotoAsset | null>((resolve, reject) => {
      const openLibrary = () => library().then(resolve).catch(reject).finally(onEnd)
      const openCamera = () => camera().then(resolve).catch(reject).finally(onEnd)

      if (index === 0) {
        void openLibrary()
      } else {
        void openCamera()
      }
    })
  }, [])
}
