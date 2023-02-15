import { type Format, defineConfig } from 'tsup'
import glob from 'glob'

export default defineConfig(() => {
  return {
    entry: glob.sync('src/*/index.ts'),
    format: ['esm', 'cjs', 'iife'],
    outExtension({ format }) {
      return {
        js: getExtensionByFormat(format),
      }
    },
    dts: true,
    splitting: true,
    minify: false,
    sourcemap: true,
    clean: true,
    treeshake: true,
    noExternal: [],
    outDir: './libs',
  }
})

//#region format extension

function getExtensionByFormat(format: Format) {
  let ext = '.js'
  switch (format) {
    case 'esm':
      ext = '.mjs'
      break
    case 'cjs':
      ext = '.cjs'
      break
    case 'iife':
      ext = '.global.js'
      break
    default:
      // eslint-disable-next-line no-case-declarations
      const n: never = format
      break
  }

  return ext
}

//#endregion
