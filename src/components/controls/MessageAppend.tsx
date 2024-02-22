import { Icons } from '@assets'
import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import { Album } from '@react-native-camera-roll/camera-roll/src/CameraRoll'
import { Dispatch, SetStateAction, memo, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Platform, StatusBar } from 'react-native'

import { AnchorMenu, IAnchorMenu } from '@src/components/controls/AnchorMenu'
import { CameraRollGallery } from '@src/components/filePicker/CameraRollGallery'
import { CameraRollPermissionDenied } from '@src/components/filePicker/CameraRollPermissionDenied'
import { DocumentPreview } from '@src/components/filePicker/DocumentPreview'
import { DocumentTypeControls } from '@src/components/filePicker/DocumentTypeControls'
import { Header } from '@src/components/nav/Header'

import { DocumentRepository } from '@src/database/repositories'
import { useEffectExceptOnMount } from '@src/hooks/common/useRenderedOnce'
import { TakePhotoAsset, useTakeFile } from '@src/hooks/useTakeFile'
import { useLocalization } from '@src/locales/localization'
import { LeftBack, setChatBodyVisibility } from '@src/screens/ChatScreen'
import { Box } from '@src/theme/helpers/Box'
import { Gap } from '@src/theme/helpers/Gap'
import { useAppTheme } from '@src/theme/theme'
import { Text } from '@src/theme/themed'
import { hasAndroidPermission } from '@src/utils/cameraRoll'

interface IMessageAppend {
  toggleFileMode: () => void
  setDocument: Dispatch<SetStateAction<number[] | undefined>>
  hasCameraRollPermissions: boolean | null
  messageInputLayoutHeight: number
  from: string
}

interface IHeaderCenterAlbumPicker {
  isCameraRollPermissions: boolean | null
  setCurrentAlbum: Dispatch<SetStateAction<Album | null>>
  currentAlbum: Album | null
  isPicked: boolean
}

const HeaderCenterAlbumPicker = memo(
  ({ isCameraRollPermissions, setCurrentAlbum, currentAlbum, isPicked }: IHeaderCenterAlbumPicker) => {
    const [albums, setAlbums] = useState<Album[]>([])
    const { insets, colors } = useAppTheme()
    const { t } = useLocalization()

    const topOffset = useMemo(
      () => Platform.select({ ios: insets.top + 8, default: (StatusBar.currentHeight || 0) + 8 }),
      [insets.top],
    )

    const selectAlbum = useCallback(
      (album: Album | null) => () => {
        setCurrentAlbum(album)
      },
      [],
    )

    useEffect(() => {
      if (isCameraRollPermissions) {
        CameraRoll.getAlbums({ assetType: 'Photos' }).then((_albums) => {
          setAlbums(_albums)
        })
      }
    }, [isCameraRollPermissions])

    const menuRows = useMemo(() => {
      const albumsArray = albums.map((item) => ({
        key: item.title,
        leftIconName: 'folder',
        labelText: item.title,
        onPress: selectAlbum(item),
      })) as IAnchorMenu['menuRows']
      albumsArray.unshift({
        key: t('gallery'),
        leftIconName: 'allGallery',
        label: 'gallery',
        onPress: selectAlbum(null),
      })
      return albumsArray
    }, [albums])

    if (isPicked) {
      return (
        <Box flex row justifyContent="center" alignItems="center">
          <Icons.svg.asset width={20} height={20} fill={colors.iconHLcolor} />
          <Gap x={8} />
          <Text colorName="accentColor">{t('selected') + ' 1'}</Text>
        </Box>
      )
    }

    return (
      <AnchorMenu
        mr={16}
        pl={4}
        pr={4}
        extraOffset={{ top: topOffset, left: 8 }}
        style={{ backgroundColor: colors.menuBackgroundColor }}
        menuRows={menuRows}
        component={
          <Box flex row justifyContent="center" alignItems="center">
            <Text>{currentAlbum?.title || t('gallery')}</Text>
            <Gap x={8} />
            <Box mt={4}>
              <Icons.svg.pickerArrowDown fill={colors.primaryTextColor} width={10} height={10} />
            </Box>
          </Box>
        }
      />
    )
  },
)

export const MessageAppend = memo(
  ({ toggleFileMode, setDocument, hasCameraRollPermissions, messageInputLayoutHeight, from }: IMessageAppend) => {
    const [isCameraRollPermissions, setIsCameraRollPermissions] = useState(hasCameraRollPermissions)
    const { colors } = useAppTheme()
    const [_document, _setDocument] = useState<TakePhotoAsset | null>(null)
    const [captured, setCaptured] = useState(false)
    const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null)

    const takePhoto = useTakeFile(() => {})

    useEffectExceptOnMount(() => {
      _setDocument(null)
    }, [currentAlbum])

    const requestPermissions = useCallback(async () => {
      const _hasAndroidPermission = await hasAndroidPermission()
      setIsCameraRollPermissions(_hasAndroidPermission)
    }, [])

    const withGallery = useCallback(async () => {
      const asset = await takePhoto(0)
      if (asset) {
        await handleAsset(asset)
        setCaptured(true)
      }
    }, [])

    useLayoutEffect(() => {
      setChatBodyVisibility(false)
      return () => {
        setDocument(undefined)
        setChatBodyVisibility(true)
      }
    }, [])

    const handleAsset = useCallback(async (asset: TakePhotoAsset) => {
      _setDocument(asset)
      if (!asset) {
        return
      }
      const newDocument = DocumentRepository.create({
        name: asset.fileName,
        path: asset.uri,
        mimeType: asset.type,
        width: asset.width,
        height: asset.height,
      })
      const newDocumentRes = await newDocument.save()
      if (newDocumentRes?.id) {
        setDocument([newDocumentRes?.id])
      }
    }, [])

    const withCamera = useCallback(async () => {
      const asset = await takePhoto(1)
      if (asset) {
        await handleAsset(asset)
        setCaptured(true)
      }
    }, [])

    const isDocumentReady = captured && _document

    const title = useMemo(() => {
      if (isDocumentReady) {
        return 'Send to ' + from
      }
      return (
        <HeaderCenterAlbumPicker
          currentAlbum={currentAlbum}
          setCurrentAlbum={setCurrentAlbum}
          isCameraRollPermissions={isCameraRollPermissions}
          isPicked={!!_document}
        />
      )
    }, [from, isDocumentReady, isCameraRollPermissions, setCurrentAlbum, currentAlbum, _document])

    const renderSelectionOrPicker = useMemo(() => {
      if (isDocumentReady) {
        return <DocumentPreview file={_document} />
      }
      if (isCameraRollPermissions) {
        return <CameraRollGallery currentAlbum={currentAlbum} handleAsset={handleAsset} />
      }
      return <CameraRollPermissionDenied requestPermissions={requestPermissions} />
    }, [isCameraRollPermissions, colors.transparent, isDocumentReady, _document, currentAlbum])

    return (
      <>
        <Header
          title={title}
          absolute
          zIndex={3}
          backgroundColor={colors.backgroundColor}
          left={
            <Box justifyContent="center" flex>
              <LeftBack alignSelf="flex-start" onBack={toggleFileMode} />
            </Box>
          }
        />
        <Box zIndex={3} flex>
          {renderSelectionOrPicker}
          {_document ? null : (
            <DocumentTypeControls
              messageInputLayoutHeight={messageInputLayoutHeight}
              withCamera={withCamera}
              withGallery={withGallery}
            />
          )}
        </Box>
      </>
    )
  },
)
