import { fileURLToPath, URL } from 'url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
// import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs'

import Unocss from '@unocss/vite'
// import VueI18n from '@intlify/vite-plugin-vue-i18n'
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'APP_')
  return {
    envPrefix: 'APP_',
    server: {
      host: '0.0.0.0',
      proxy: {
        '^/api': {
          target: env.APP_BASE_URL ?? 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },

    plugins: [
      vue(),
      vueJsx(),

      Unocss('./unocss.config.js'),
      Components({
        dirs: ['./src/components', './src/layouts'],
        include: [/\.vue$/, /\.vue\?vue/],
        resolvers: [PrimeVueResolver({ importIcons: true, importStyle: true, prefix: 'P' })],
        dts: './src/types/components/components.d.ts',
      }),
      Pages(),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          '@vueuse/core',
          '@vueuse/head',
          {
            'vue-i18n': ['useI18n'],
          },
          {
            '@vueuse/integrations/useCookies': [['useCookies', 'useCookie']],
          },
          {
            '@/main': ['useApp', 'useGlobals'],
          },

          {
            '@/plugins/0/axios.plugin': ['useApi'],
          },
          {
            '@/plugins/1/lodash.plugin': ['useLodash'],
          },
        ],
        eslintrc: {
          enabled: true,
          filepath: './src/types/auto-imports/auto-imports.json',
        },

        dts: './src/types/auto-imports/auto-imports.d.ts',
      }),
      Layouts({
        layoutsDirs: 'src/layouts',
        defaultLayout: 'default',
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // optimizeDeps: {
    //   esbuildOptions: {
    //     plugins: [esbuildCommonjs(['matrix-js-sdk', 'safe-buffer'])],
    //   },
    // },
  }
})
