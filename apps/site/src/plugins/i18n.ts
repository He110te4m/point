import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'

const vueI18n = createI18n({
  locale: 'zh-CN',
  fallbackLocale: 'en',
  messages,
})
export const init: AppPlugin['init'] = ({ app }) => {
  app.use(vueI18n)
}

export const { global: i18n } = vueI18n
