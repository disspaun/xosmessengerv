import { isEmpty } from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PartialRecord } from '@src/mytypes'

export interface IUseCredentialsFrom<T extends string> {
  initialState: Record<T, string>
  validators?: PartialRecord<T, (value: string, state: Record<T, string>) => boolean>
  onSubmit?: (values: Record<T, string>) => void | string | Promise<any | { error?: string }>
}

const errorsLabels = {
  accountValue: 'accountValueValidationError',
  nickname: 'nicknameValidationError',
  password: 'passwordValidationError',
  confirmPassword: 'confirmPasswordValidationError',
  optionalNickname: 'optionalNicknameValidationError',
  publickey: 'publickeyValidationError',
  privateKey: 'privateKeyValidationError',
  seedPhrase: 'seedPhraseValidationError',
  account: 'accountValidationError',
}

export const useForm = <T extends string>({ initialState, validators, onSubmit }: IUseCredentialsFrom<T>) => {
  const [inputState, setInputState] = useState<Record<T, string>>(initialState)
  const { t } = useTranslation()

  const handleOnChange = useCallback(
    (input: T) => (text: string) => {
      setInputState((prevState) => {
        return { ...prevState, ['_errorText']: '', [input]: text }
      })
    },
    [],
  )

  const errors = useMemo(() => {
    let errors = {} as Record<T, string>
    if (!validators) {
      return errors
    }
    for (const validatorKey in validators) {
      if (!inputState[validatorKey]) {
        continue
      }
      const result = validators[validatorKey]?.(inputState[validatorKey], inputState)
      if (result) {
        errors = { ...errors, [validatorKey]: t(errorsLabels[validatorKey]) || '' }
      }
    }

    return errors
  }, [inputState, validators])

  const isAllSet = Object.keys(inputState).every((key) => inputState[key] !== '' || !validators?.[key])

  const submitHandler = useCallback(async () => {
    const result = await onSubmit?.(inputState)
    if (result?.error) {
      handleOnChange('_errorText')(result.error)
    }
  }, [inputState])

  const displayError = inputState['_errorText'] || errors[Object.keys(errors)[0]]
  const disabled = !!inputState['_errorText'] || !isEmpty(errors) || !isAllSet

  return {
    handleOnChange,
    submitHandler,
    disabled,
    errors,
    initialState,
    inputState,
    displayError,
  }
}
