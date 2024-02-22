import { Category } from '../interfaces'
import { Icons } from '@assets'
import { ScrollView } from 'react-native'

import { Box } from '@src/theme/helpers/Box'
import { Gap } from '@src/theme/helpers/Gap'
import { useAppTheme } from '@src/theme/theme'

interface ITabBar {
  categories: Readonly<Category[]>
  activeCategory: Category

  onPress(category: Category): () => void
}

export const EmojiTabBar = ({ categories, activeCategory, onPress }: ITabBar) => {
  const { colors } = useAppTheme()

  return (
    <Box mt={3} mb={3}>
      <ScrollView
        contentContainerStyle={{ marginLeft: 12, marginRight: 12 }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {categories.map((category) => {
          const Icon = Icons.svg[category.icon] || null
          return (
            <Box
              key={category.key}
              borderRadius={4}
              p={4}
              mt={2}
              mb={2}
              alignItems="center"
              justifyContent="center"
              backgroundColor={category.key === activeCategory.key ? colors.bgTextButton : 'transparent'}
              onPress={onPress(category)}
            >
              {Icon ? <Icon width={24} height={24} fill={colors.iconColor} /> : null}
            </Box>
          )
        })}
        <Gap x={24} />
      </ScrollView>
    </Box>
  )
}
