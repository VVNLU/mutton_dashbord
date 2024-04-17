import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { fileURLToPath, URL } from 'url'
import WindiCSS from 'vite-plugin-windicss'
import path from 'path-browserify'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar({
      sassVariables: 'src/styles/abstracts/quasar-variables.scss',
    }),
    WindiCSS(),
    createSvgIconsPlugin({
      // Specify the icon folder to be cached
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      // Specify symbolId format
      symbolId: 'icon-[name]',
    })
    // VueI18nPlugin({
    //   compositionOnly: false,
    //   runtimeOnly: false,
    //   include: ['./src/locales/**/*.json'],
    // }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      path: 'path-browserify'
    },
  },
})
