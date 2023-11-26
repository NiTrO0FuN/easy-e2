import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { Quasar, Notify } from 'quasar'
import quasarLang from 'quasar/lang/en-GB'
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
// Import Quasar css
import 'quasar/src/css/index.sass'

import router from '@/router'

import { createI18n } from 'vue-i18n'
import messages from './localisation/loc'

const i18n = createI18n({
  locale: navigator.language.split("-")[0], // set locale
  fallbackLocale: 'en', // set fallback locale
  messages,
})

const myApp = createApp(App)
const pinia = createPinia()

myApp.use(Quasar, {
    plugins: {Notify}, // import Quasar plugins and add here
    lang: quasarLang,
  })
  
myApp.use(router)
myApp.use(pinia)

myApp.use(i18n)

myApp.mount('#app')
