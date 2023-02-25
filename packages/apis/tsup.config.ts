import { type Options, defineConfig } from 'tsup'
import glob from 'glob'
import { getExtensionByFormat } from '@he110/utils'

export default defineConfig(({ platform }) => {
  return {
    ...getConfig(platform),
    entry: glob.sync('src/*/index.ts').concat('src/main.ts'),
    format: ['esm', 'cjs', 'iife'],
    outExtension({ format }) {
      return {
        js: getExtensionByFormat(format),
      }
    },
    dts: true,
    splitting: true,
    minify: true,
    sourcemap: true,
    clean: true,
    treeshake: true,
    noExternal: [
      '@he110/point-request',
    ],
  }
})

function getConfig(platform: Options['platform'] = 'node'): Options {
  return {
    platform,
    outDir: `./libs/${platform}`,
  }
}
