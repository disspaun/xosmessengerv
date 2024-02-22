import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import { LoremIpsum } from 'lorem-ipsum'
import { Dispatch, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { LayoutAnimation } from 'react-native'
import { LessThan } from 'typeorm'
import { useImmerReducer } from 'use-immer'

import { Emojis, Stickers } from '@src/components/emojiBar/data'

import { Chat } from '@src/database/models'
import { ChatRepository, DocumentRepository, MessageRepository } from '@src/database/repositories'
import { ChatActions, chatReducer } from '@src/draft/reducers/chatReducer'
import { Chat as ChatModel } from '@src/draft/types'
import { Message } from '@src/draft/types'
import { convertCameraRollPicturesToImageDtoType } from '@src/hooks/useGallery'
import { dispatchChats } from '@src/providers/ChatProvider'
import { isChatBodyVisible, isChatListEndNotViewing } from '@src/screens/ChatScreen'
import { hasAndroidPermission } from '@src/utils/cameraRoll'
import { randomIntFromInterval } from '@src/utils/number'
import { sleep } from '@src/utils/sleep'

interface IUpdate {
  newMessage: Message
  chat: ChatModel
  animate?: boolean
  forceUpdate?: boolean
}

const update = async ({ newMessage, chat, animate, forceUpdate }: IUpdate) => {
  const count = isChatBodyVisible() && !isChatListEndNotViewing(newMessage.with) ? 0 : 1
  const isOutcoming = newMessage.from === 'Me'
  const params = count
    ? { lastMessageId: newMessage.id, count: () => 'count + :cnt' }
    : { lastMessageId: newMessage.id, count: 0 }
  await ChatRepository.createQueryBuilder()
    .update(Chat)
    .set(params)
    .setParameter('cnt', isOutcoming ? 0 : count)
    .where('id = :id', { id: chat.id })
    .execute()
  messagesDispatchRef?.({ type: 'ADD_MESSAGE', message: newMessage, with: chat.from, forceUpdate })
  if (animate) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
  }
  dispatchChats?.({
    type: 'UPDATE_CHAT',
    chat: { ...chat, lastMessageId: newMessage.id, count },
    isOutcoming,
  })
}

const lorem = new LoremIpsum({
  wordsPerSentence: {
    max: 64,
    min: 8,
  },
})

let spamMessageProcessing = false
let spamAssets = null

export const clearSpamMessageProccesing = () => {
  spamMessageProcessing = false
}

export const spamSomething = async (chat: ChatModel) => {
  if (spamMessageProcessing) {
    return
  }
  spamMessageProcessing = true
  let photoAsset = null
  if (await hasAndroidPermission()) {
    if (!spamAssets) {
      const { edges } = await CameraRoll.getPhotos({
        include: ['filename', 'fileSize', 'fileExtension', 'imageSize'],
        assetType: 'Photos',
        first: 10,
      })
      spamAssets = edges
    }
    const randomPhotoIndexFromFirstTen = randomIntFromInterval(1, spamAssets.length) - 1
    photoAsset = convertCameraRollPicturesToImageDtoType(spamAssets)[randomPhotoIndexFromFirstTen]
  }
  const randomInt = randomIntFromInterval(1, 4)
  let documents = undefined
  let sticker = undefined
  let emoji = undefined
  const isFileAchieved = randomInt === 3 && photoAsset
  if (isFileAchieved) {
    const newDocument = DocumentRepository.create({
      name: photoAsset.filename || '',
      path: photoAsset.uri,
      mimeType: photoAsset.extension || '',
      width: photoAsset.width,
      height: photoAsset.height,
    })
    const newDocumentRes = await newDocument.save()
    documents = [newDocumentRes?.id]
  }
  if (randomInt === 2) {
    sticker = Stickers[randomIntFromInterval(1, Stickers.length)].name
  }
  if (randomInt === 1) {
    emoji = Emojis[randomIntFromInterval(1, Emojis.length)].name
  }
  const newMessage = MessageRepository.create({
    timestamp: new Date().getTime(),
    body: sticker ? '' : isFileAchieved ? '' : emoji ? emoji : lorem.generateSentences(1),
    with: 'Spambot1',
    from: randomInt % 2 === 0 ? 'Me' : 'Spambot1',
    documents: documents,
    sticker,
  })
  const newMessageRes = await newMessage.save()
  await update({ newMessage: newMessageRes, chat })
  setTimeout(() => {
    spamMessageProcessing = false
  }, 250)
}

export const sendMessage = async ({
  message,
  documents,
  from,
  animate,
  sticker,
  isFileModeEnabled,
}: {
  from: string
  message?: string
  documents?: number[]
  animate?: boolean
  sticker?: string
  isFileModeEnabled?: boolean
}) => {
  try {
    const chat = await ChatRepository.findOne({ where: { from } })
    if (!chat) {
      return
    }
    const { sectionListRef } = require('@src/screens/ChatScreen')
    // if (!isFileModeEnabled) {
    sectionListRef.current?.getScrollResponder()?.scrollTo({ y: 0 })
    // }
    const newMessage = MessageRepository.create({
      timestamp: new Date().getTime(),
      body: message,
      with: from,
      from: 'Me',
      documents: documents,
      sticker,
    })
    const newMessageRes = await newMessage.save()
    if (newMessageRes?.id) {
      await update({ newMessage: newMessageRes, chat, animate, forceUpdate: true })
      await sleep(1500)
      const oppositeNewMessage = MessageRepository.create({
        timestamp: new Date().getTime(),
        body: message,
        with: from,
        from,
        documents: documents,
        sticker,
      })
      const oppositeMessageRes = await oppositeNewMessage.save()
      if (oppositeMessageRes?.id) {
        await update({ newMessage: oppositeMessageRes, chat, animate, forceUpdate: true })
      }
    }
  } catch (e) {
    alert(JSON.stringify(e))
  }
}

export const clearChatUnreadCount = async (from: string) => {
  const chat = await ChatRepository.findOne({ where: { from } })
  if (chat) {
    await ChatRepository.createQueryBuilder()
      .update(Chat)
      .set({ count: 0 })
      .where('id = :id', { id: chat.id })
      .execute()

    dispatchChats?.({
      type: 'UPDATE_CHAT',
      chat: {
        id: chat.id,
        name: chat.name,
        status: chat.status,
        avatar: chat.avatar,
        lastMessageId: chat.lastMessageId,
        from: chat.from,
        count: 0,
      },
    })
  }
}

export let messagesDispatchRef: Dispatch<ChatActions> | null = null

export const useChat = (from: string) => {
  const preparedChatReducer = useMemo(() => chatReducer(from), [from])
  const [messages, messagesDispatch] = useImmerReducer<Message[], ChatActions>(preparedChatReducer, [])
  const [lastId, setLastId] = useState(0)
  const [total, setTotal] = useState(0)
  const loading = useRef(false)
  const lastIdSaved = useRef<number | null>(null)

  useLayoutEffect(() => {
    void clearChatUnreadCount(from)
  }, [])

  useEffect(() => {
    messagesDispatchRef = messagesDispatch
    return () => {
      messagesDispatchRef = null
    }
  }, [messagesDispatch])

  const lookUp = useCallback(async () => {
    loading.current = true
    let _lastId = lastId
    if (lastIdSaved.current === _lastId) {
      _lastId = messages[messages.length - 1].id
    }
    const [_messages, _total] = await MessageRepository.findAndCount({
      where: { with: from, ...(_lastId ? { id: LessThan(_lastId) } : {}) },
      take: 100,
      order: { id: 'DESC' },
    })
    setTotal(_total)
    messagesDispatch({ type: 'ADD_MESSAGES', messages: _messages, with: from })
    lastIdSaved.current = _lastId
    loading.current = false
  }, [lastId, messages])

  useEffect(() => {
    if (loading.current) {
      return
    }
    void lookUp()
  }, [lastId])

  return { messages, sendMessage, total, lastId, setLastId }
}
