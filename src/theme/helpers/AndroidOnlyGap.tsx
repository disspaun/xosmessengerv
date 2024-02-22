import { Gap } from '@src/theme/helpers/Gap'
import { isIOS } from '@src/utils/isIOS'

export const AndroidOnlyGap = ({ height }: { height: number }) => {
  if (isIOS) {
    return null
  }
  return <Gap y={height} />
}
