import { defineConfig, presetUno, presetIcons, presetWebFonts, transformerDirectives } from 'unocss'
import { presetTypography } from '@unocss/preset-typography'

import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import { isNumber, parseInt } from 'lodash'

const colorList = ['primary', 'secondary', 'tertiary', 'success', 'error', 'warning', 'info', 'help']

export function createConfig() {
  return defineConfig({
    presets: [
      presetUno({
        rules: [],
      }),
      presetIcons({
        collections: {
          figma: () => import('./figma/json/icons.json'),
          asset: FileSystemIconLoader('./src/assets/icons', (svg) => svg.replace(/black/, 'currentColor')),
          fas: () => import('@iconify/json/json/fa6-solid.json'),
          fab: () => import('@iconify/json/json/fa6-brands.json'),
          far: () => import('@iconify/json/json/fa6-regular.json'),
          // heros: () => import('@iconify/json/json/heroicons-solid.json').then((i) => i.default as any),
          // hero: () => import('@iconify/json/json/heroicons-outline.json').then((i) => i.default as any),
        },
        autoInstall: true,
      }),
      presetTypography() as any,
      presetWebFonts({
        provider: 'google',
        fonts: {
          alma: {
            name: 'Almarai',
            italic: true,
            weights: [300, 400, 700, 800],
          },
          noto: {
            name: 'Noto Sans Arabic',
            italic: true,
            weights: [300, 400, 700, 800],
          },
          poppins: {
            name: 'Poppins',
            italic: true,
            weights: [300, 400, 700, 800],
          },
          plex: {
            name: 'IBM Plex Sans Arabic',
            italic: true,
            weights: [300, 400, 700, 800]
          }
        },
      }),
    ],
    rules: [
      [
        'primary-gradient',
        {
          background: 'linear-gradient(360deg, #3E90FF -0.13%, #73CCFE 100.13%)',
        },
      ],
      [
        'h-unset',
        {
          height: 'unset',
        },
      ],
      [
        'primary-shadow',
        {
          '-webkit-box-shadow': '0px 1px 5px 2px rgba(0,0,0,0.15)',
          '-moz-box-shadow': '0px 1px 5px 2px rgba(0,0,0,0.15)',
          'box-shadow': '0px 1px 5px 2px rgba(0,0,0,0.15)',
        },
      ],
    ],
    shortcuts: [
      {
        defaults: 'bg-bg-primary-light text-text-primary shadow-text-primary/10 border-text-primary-light',
      },
      {
        'card-defaults':
          'border border-bg-purple-light/50 mx-px lg:border-none lg:mx-0 bg-bg-primary text-text-primary lg:shadow-text-primary/10 lg:border-text-primary-light lg:primary-shadow lg:rounded-xl',
      },
      {
        'btn-hover': 'cursor-pointer hover:scale-105 duration-300 transform',
      },
      [
        /^flex-center-(.*)$/,
        ([, c]) => (['1', 'none'].includes(c) ? `flex justify-center items-center flex-${c}` : ''),
      ],
      [
        /^btn-outlined-(.*)$/,
        ([, c]) =>
          colorList.includes(c)
            ? ` bg-inherit border-px text-${c} hover:bg-${c}-light/20 active:bg-${c}-light/30 disabled:bg-gray-100 disabled:hover:bg-gray-100`
            : '',
      ],
      [
        /^btn-flat-(.*)$/,
        ([, c]) =>
          colorList.includes(c)
            ? ` bg-inherit text-${c} hover:bg-${c}-light/20 active:bg-${c}-light/30 disabled:bg-gray-100 disabled:hover:bg-gray-100`
            : '',
      ],
      [
        /^btn-(.*)$/,
        ([, c]) =>
          colorList.includes(c)
            ? ` bg-${c} drop-shadow text-${c}-text hover:bg-${c}-dark active:bg-${c}-active disabled:bg-${c}-light disabled:hover:bg-${c}-light `
            : '',
      ],
      [/^linear-gradient-([^-].*)-([^-].*)$/, ([, from, to]) => `bg-gradient-linear to-${to} from-${from}`],
      [
        /^opacity-gradient-([^-].*)-([^-].*)$/,
        ([, color, opacity]) => `bg-white bg-gradient-linear from-${color} to-${color + '/' + opacity}`,
      ],
      [/^start-(.*)$/, ([, c]) => (isNumber(parseInt(c)) ? `ltr:left-${c} rtl:right-${c}` : '')],
      [/^end-(.*)$/, ([, c]) => (isNumber(parseInt(c)) ? `ltr:right-${c} rtl:left-${c}` : '')],
    ],

    include: [/\.ts$/, /\.json$/, /\.vue$/, /\.vue\?vue/],
    exclude: ['**/node_modules/**'],
    theme: {
      colors: {
        // generic text & background
        textPrimary: 'rgb(var(--text-primary-color))',
        textPrimaryDark: 'rgb(var(--text-primary-dark-color))',
        textPrimaryLight: 'rgb(var(--text-primary-light-color))',
        textSecondary: 'rgb(var(--text-secondary-color))',
        textSecondaryDark: 'rgb(var(--text-secondary-dark-color))',
        textSecondaryLight: 'rgb(var(--text-secondary-light-color))',
        // TODO: we need to remove these custom colors
        textBlueLight: 'rgb(var(--text-blue-light-color))',

        bgPrimary: 'rgb(var(--bg-primary-color))',
        bgPrimaryDark: 'rgb(var(--bg-primary-dark-color))',
        bgPrimaryDarker: 'rgb(var(--bg-primary-darker-color))',
        bgPrimaryLight: 'rgb(var(--bg-primary-light-color))',
        bgPrimaryExtraLight: 'rgb(var(--primary-extra-light-color))',

        // TODO: we need to remove these custom colors
        bgSecondaryGray: 'rgb(var(--bg-secondary-gray-color))',
        // bg-secondary: none,
        bgSecondary: 'rgb(var(--bg-secondary-color))',
        bgSecondaryDark: 'rgb(var(--bg-secondary-dark-color))',
        bgSecondaryLight: 'rgb(var(--bg-secondary-light-color))',
        // TODO: we need to remove these custom colors
        bgGray: 'rgb(var(--bg-gray-color))',
        bgGrayDark: 'rgb(var(--bg-gray-dark-color))',
        bgPurpleLight: 'rgb(var(--bg-purple-light-color))',
        bgRedLight: 'rgb(var(--bg-red-light-color))',
        bgBorder: 'rgb(var(--bg-border-light))',
        // primary
        primary: 'rgb(var(--primary-color))',
        primaryOverlay: 'rgb(var(--primary-overlay-text-color))',
        primaryActive: 'rgb(var(--primary-active-color))',
        primaryText: 'rgb(var(--primary-text-color))',
        primaryDark: 'rgb(var(--primary-dark-color))',
        primaryLight: 'rgb(var(--primary-light-color))',
        // secondary
        secondary: 'rgb(var(--secondary-color))',
        secondaryOverlay: 'rgb(var(--secondary-overlay-text-color))',
        secondaryActive: 'rgb(var(--secondary-active-color))',
        secondaryText: 'rgb(var(--secondary-text-color))',
        secondaryDark: 'rgb(var(--secondary-dark-color))',
        secondaryLight: 'rgb(var(--secondary-light-color))',
        // tertiary
        tertiary: 'rgb(var(--tertiary-color))',
        tertiaryOverlay: 'rgb(var(--tertiary-overlay-text-color))',
        tertiaryActive: 'rgb(var(--tertiary-active-color))',
        tertiaryText: 'rgb(var(--tertiary-text-color))',
        tertiaryDark: 'rgb(var(--tertiary-dark-color))',
        tertiaryLight: 'rgb(var(--tertiary-light-color))',
        // error
        error: 'rgb(var(--error-color))',
        errorOverlay: 'rgb(var(--error-overlay-text-color))',
        errorActive: 'rgb(var(--error-active-color))',
        errorText: 'rgb(var(--error-text-color))',
        errorDark: 'rgb(var(--error-dark-color))',
        errorLight: 'rgb(var(--error-light-color))',
        // success
        success: 'rgb(var(--success-color))',
        successOverlay: 'rgb(var(--success-overlay-text-color))',
        successActive: 'rgb(var(--success-active-color))',
        successText: 'rgb(var(--success-text-color))',
        successDark: 'rgb(var(--success-dark-color))',
        successLight: 'rgb(var(--success-light-color))',
        // warning
        warning: 'rgb(var(--warning-color))',
        warningOverlay: 'rgb(var(--warning-overlay-text-color))',
        warningActive: 'rgb(var(--warning-active-color))',
        warningText: 'rgb(var(--warning-text-color))',
        warningDark: 'rgb(var(--warning-dark-color))',
        warningLight: 'rgb(var(--warning-light-color))',
        // info
        info: 'rgb(var(--info-color))',
        infoOverlay: 'rgb(var(--info-overlay-text-color))',
        infoActive: 'rgb(var(--info-active-color))',
        infoText: 'rgb(var(--info-text-color))',
        infoDark: 'rgb(var(--info-dark-color))',
        infoLight: 'rgb(var(--info-light-color))',
        // help
        help: 'rgb(var(--help-color))',
        helpOverlay: 'rgb(var(--help-overlay-text-color))',
        helpActive: 'rgb(var(--help-active-color))',
        helpText: 'rgb(var(--help-text-color))',
        helpDark: 'rgb(var(--help-dark-color))',
        helpLight: 'rgb(var(--help-light-color))',

        // custom colors
        link: 'rgb(var(--link-color))',
      },
    },
    transformers: [transformerDirectives()],
  })
}

export default createConfig()
