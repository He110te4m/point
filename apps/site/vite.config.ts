import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Page from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
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
      Page(),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          '@vueuse/core',
        ],
        dts: 'types/auto-import.d.ts',
        dirs: [
        ],
        vueTemplate: true,
      }),

      // https://github.com/antfu/vite-plugin-components
      Components({
        dts: 'types/components.d.ts',
        globs: [
        ],
      }),

      Inspect(),
    ],
  }
})
