export interface NavItem {
  title: string
  url: string
  children?: NavItem[]
}

export const navs: NavItem[] = [
  {
    title: '',
    url: '',
  },
]
