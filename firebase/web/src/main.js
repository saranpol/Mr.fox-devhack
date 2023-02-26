import { createApp } from "vue"
import { createPinia } from "pinia"

import firebaseConfig from "./firebaseConfig"
import App from "./App.vue"
import router from "./router"
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

const firebaseApp = firebaseConfig.app
console.log("firebaseApp", firebaseApp)

loadFonts()

let app = null
const auth = getAuth()
onAuthStateChanged(auth, (user) => {
  if (!app) {
    app = createApp(App)
      .use(createPinia())
      .use(router)
      .use(vuetify)
      .mount("#app")
  }
})