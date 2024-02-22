import { PermissionsAndroid } from 'react-native'
import { Dirs, FileSystem } from 'react-native-file-access'

import { TakePhotoAsset } from '@src/hooks/useTakeFile'

export const documentDirectoryPath = Dirs.DocumentDir

export const checkReadWriteStoragePermissions = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ])
    if (
      granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] !== 'granted' ||
      granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] !== 'granted'
    ) {
      return false
    }
    return true
  } catch (err) {
    return false
  }
}

export const copyFile = async (target: string, path: string, type?: string) => {
  if (!(await checkReadWriteStoragePermissions())) {
    return null
  }
  const fileName = target.split('/')?.[1] || target
  const targetLocation = `${documentDirectoryPath}/${fileName}${type ? '.' + type : ''}`

  console.log('copy file path', path, 'target', target)

  try {
    const exists = await FileSystem.exists(decodeURIComponent(targetLocation))
    if (exists) {
      await FileSystem.unlink(decodeURIComponent(targetLocation))
    }
    await FileSystem.cp(decodeURIComponent(path), decodeURIComponent(targetLocation))
    return targetLocation.includes('file://') ? targetLocation : `file://${targetLocation}`
  } catch (e) {
    console.log('copy file error', e)
    return null
  }
}

export const checkAndProvideAssetFileCopy = async (file: TakePhotoAsset) => {
  let _file = file
  let _uri = _file.uri
  console.log(_file)
  if (_file.fileName && _file.uri) {
    const newUri = await copyFile(_file.fileName, _file.uri)
    console.log('newUri: ', newUri)
    if (newUri) {
      _uri = newUri
      _file = { ...file, uri: _uri }
      return _file
    }
    return _file
  }
  return null
}
