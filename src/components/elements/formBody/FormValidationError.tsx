import { Box } from '@src/theme/helpers/Box'
import { Gap } from '@src/theme/helpers/Gap'
import { Text } from '@src/theme/themed'

interface IFormValidationError {
  disabled: boolean
  errorText?: string
}

export const FormValidationError = ({ disabled, errorText }: IFormValidationError) => {
  if (disabled) {
    return (
      <Box mb={4}>
        <Text numberOfLines={1} type="semiSecondary" colorName="errorTextColor">
          {errorText || ''}
        </Text>
      </Box>
    )
  }
  return <Gap y={16} />
}
