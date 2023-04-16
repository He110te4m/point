import { i18n } from '~/plugins/i18n'

export interface NavItem {
  title: string
  url: string
  children?: NavItem[]
}

export const navs: NavItem[] = [
  {
    title: i18n.t('app.global.nav.index'),
    url: '/',
  },
  {
    title: i18n.t('app.global.nav.articles'),
    url: '/articles',
    children: [
      {
        title: i18n.t('app.global.nav.article_frontend'),
        url: '/articles?category=FE',
      },
      {
        title: i18n.t('app.global.nav.article_php'),
        url: '/articles?category=PHP',
      },
    ],
  },
  {
    title: i18n.t('app.global.nav.notes'),
    url: '/notes',
  },
  {
    title: i18n.t('app.global.nav.aboutme'),
    url: '/aboutme',
  },
]
