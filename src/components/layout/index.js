import { BlurView, VibrancyView } from '@react-native-community/blur'

import { isIOS } from '@src/utils/isIOS'

export const PlatformBlur = isIOS ? VibrancyView : BlurView
