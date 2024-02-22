import { capitalize, groupBy } from 'lodash'
import moment from 'moment'

import { Message } from '@src/draft/types'
import { createdAtFormatChat } from '@src/utils/time'

export const getChatSections = (messagesArray: Message[], translations: { today: string; yesterday: string }) => {
  let grouped = groupBy(messagesArray, function (message: Message) {
    return moment(Number(message.timestamp)).startOf('day').format()
  })
  let sections = Object.keys(grouped).map((key) => {
    const title = createdAtFormatChat(key, translations)
    return {
      title: capitalize(title),
      data: grouped[key],
    }
  })
  return sections
}
