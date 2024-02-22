import { Linking, Platform } from 'react-native'

export const openUrl = async (url: string) => {
  try {
    await Linking.openURL(url)
  } catch (e) {
    console.log('open url error', e)
  }
}
