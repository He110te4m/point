import { useNavMenus } from '@he110/vue-headless/libs/NavMenu'

export interface NavItem {
  title: string
  url: string
  children?: NavItem[]
}

export function useNavs(navs: NavItem[]) {
  const currentKey = ref('')

  const { activeTree } = useNavMenus(currentKey, {
    source: navs,
    key: 'url',
    children: 'children',
  })

  return {
    currentKey,
    activeTree,
  }
}
