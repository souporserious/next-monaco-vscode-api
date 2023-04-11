import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const themePath = resolve(process.cwd(), 'theme.json')

/** @type {import('next').NextConfig} */
export default {
  assetPrefix:
    process.env.NODE_ENV === 'production'
      ? undefined
      : 'http://localhost:3000/',
  experimental: {
    appDir: true,
  },
  env: {
    MONACO_THEME: await readFile(themePath, 'utf-8'),
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    })

    return config
  },
}
