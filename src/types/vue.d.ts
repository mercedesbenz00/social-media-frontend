declare module '*.vue' {
  import { defineComponent } from 'vue'
  export default defineComponent
}

declare module 'moment-with-locales-es6' {
  import moment from 'moment'
  export = moment
}
