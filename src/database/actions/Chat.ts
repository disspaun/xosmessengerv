import { StatusUser } from '../../../tm/Types'

import { ChatRepository, MessageRepository } from '@src/database/repositories'
import { dispatchChats } from '@src/providers/ChatProvider'

export const populateChatTemp = async () => {
  try {
    if ((await ChatRepository.find({})).length) {
      let chats = await ChatRepository.find({})
      if (chats.length === 2) {
        const chat3 = ChatRepository.create({
          id: 3,
          name: 'Spambot',
          status: StatusUser.Available,
          from: 'Spambot1',
        })

        await chat3.save()
        chats = await ChatRepository.find({})
      }
      dispatchChats?.({ type: 'SET_CHATS', chats })

      return
    }
    const chat = ChatRepository.create({ id: 1, name: 'Echoservice', status: StatusUser.Available, from: 'Echobot' })

    await chat.save()

    const chat2 = ChatRepository.create({
      id: 2,
      name: 'Echoservice1',
      status: StatusUser.Available,
      from: 'Echobot1',
      lastMessageId: 1,
    })

    await chat2.save()

    const chat3 = ChatRepository.create({
      id: 3,
      name: 'Spambot',
      status: StatusUser.Available,
      from: 'Spambot1',
    })

    await chat3.save()

    const newMessage = MessageRepository.create({
      id: 1,
      timestamp: new Date().getTime(),
      body: 'Hello my friend',
      with: 'Echobot1',
      from: 'Echobot1',
    })

    await newMessage.save()

    const chats = await ChatRepository.find({})

    // const messagesToPopulate = await Promise.all(
    //   chats.map(async (chat) => {
    //     return await MessageRepository.findOne({ where: { with: chat.from }, order: { id: 'DESC' } })
    //   }),
    // )

    dispatchChats?.({ type: 'SET_CHATS', chats })
  } catch (e) {
    alert(JSON.stringify(e))
  }
}
