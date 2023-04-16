import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'

export const init: AppPlugin['init'] = ({ app }) => {
  const i18n = createI18n({
    locale: 'zh-CN',
    fallbackLocale: 'en',
    messages,
  })

  app.use(i18n)
}
