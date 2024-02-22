import { LanguageDetectorModule } from 'i18next'
import { Platform } from 'react-native'

import { I18nManager, SettingsManager } from './TurboNativeModules'

const RNLanguageDetector: LanguageDetectorModule = {
  type: 'languageDetector',
  init: () => {},
  detect: () => {
    const locale =
      Platform.OS === 'ios'
        ? SettingsManager?.settings?.AppleLocale || SettingsManager?.settings?.AppleLanguages?.[0] // iOS 13
        : I18nManager?.localeIdentifier
    return locale?.split('_')?.[0]
  },
  cacheUserLanguage: () => {},
}

export default RNLanguageDetector
