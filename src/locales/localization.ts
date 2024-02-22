import i18next, { TFunction } from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'

import RNLanguageDetector from '@src/locales/Detector'

import en from './en.json'
import ru from './ru.json'

export const resources = {
  ru: {
    translation: ru,
  },
  en: {
    translation: en,
  },
} as const

type GetKeys<T> = T extends `${infer K}_${string}` ? K : T

export type LocalizationKeys = GetKeys<keyof (typeof resources)['ru' | 'en']['translation']>

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: string
    resources: (typeof resources)['en'] | (typeof resources)['ru']
    // if you see an error like: "Argument of type 'DefaultTFuncReturn' is not assignable to parameter of type xyz"
    // set returnNull to false (and also in the i18next init options)
    // returnNull: false;
  }
}

void i18next
  .use(initReactI18next)
  .use(RNLanguageDetector)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru'],
    defaultNS: 'translation',
    resources,
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
  })

type TFunctionOptions = Parameters<TFunction>[1]
// type TFunctionKeys = Parameters<TFunction>[0]

export const useLocalization = useTranslation as (...p: Parameters<typeof useTranslation>) => Omit<
  ReturnType<typeof useTranslation>,
  't'
> & {
  t: (k: LocalizationKeys, opts?: TFunctionOptions) => string
}
