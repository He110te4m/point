import { type Options, defineConfig } from 'tsup'
import glob from 'glob'
import { getExtensionByFormat } from '@he110/utils'

export default defineConfig(({ platform }) => {
  return {
    ...getConfig(platform),
    entry: glob.sync('src/index.ts'),
    format: ['esm'],
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
      'axios',
      'klona',
      'qs',
    ],
  }
})

function getConfig(platform: Options['platform'] = 'node'): Options {
  return {
    platform,
    outDir: `./libs/${platform}`,
  }
}
