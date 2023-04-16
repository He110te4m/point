import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Page from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import I18n from '@intlify/unplugin-vue-i18n/vite'
import Inspect from 'vite-plugin-inspect'

const projectRootDir = __dirname

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '~/': `${resolve(projectRootDir, 'src')}/`,
      },
    },
    server: {
      watch: {
        usePolling: true,
      },
    },
    plugins: [
      vue(),

      Page({
        dirs: [
          'src/pages',
        ],
        extensions: ['vue'],
      }),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'vue-i18n',
        ],
        dts: 'types/auto-import.d.ts',
      }),

      // https://github.com/antfu/vite-plugin-components
      Components({
        dts: 'types/components.d.ts',
      }),

      // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
      I18n({
        runtimeOnly: false,
        include: [resolve(__dirname, './public/locales/**')],
        defaultSFCLang: 'yaml',
      }),

      Inspect(),
    ],
  }
})
