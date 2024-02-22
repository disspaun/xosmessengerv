import moment from 'moment'

export const createdAtFormatShort = (date: string | number): string => {
  const today = moment().startOf('day').toString()
  const dateFormat = moment(date).startOf('day').toString()
  if (dateFormat === today) {
    return moment(date).format('HH:mm')
  }
  return moment(date).format('DD MMM')
}

export const createAtFormatChatShort = (date: string | number): string => {
  return moment(date).format('HH:mm')
}

export const createdAtFormatChat = (date: string, translations: { today: string; yesterday: string }) => {
  const today = moment().startOf('day').toString()
  const yesterday = moment().startOf('day').subtract(1, 'day').toString()
  const dateFormat = moment(date).startOf('day').toString()
  if (dateFormat === today) {
    return translations.today
  } else if (dateFormat === yesterday) {
    return translations.yesterday
  } else {
    return moment(date).format('dddd, DD MMMM')
  }
}
