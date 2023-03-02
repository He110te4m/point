import { defineConfig } from 'tsup'
import glob from 'glob'
import { getExtensionByFormat } from '@he110/utils'

export default defineConfig(() => {
  return {
    entry: glob.sync('src/index.ts'),
    format: ['esm', 'cjs', 'iife'],
    outExtension({ format }) {
      return {
        js: getExtensionByFormat(format),
      }
    },
    dts: true,
    splitting: true,
    minify: true,
    sourcemap: false,
    clean: true,
    treeshake: true,
    noExternal: [
    ],
    platform: 'browser',
    outDir: './libs',
  }
})
