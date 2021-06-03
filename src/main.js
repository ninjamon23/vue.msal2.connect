import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { MsalPlugin } from './msal-vue-plugin.js'

const msalConfig = {
  auth: {
    clientId: '73d554dc-cc13-4e1a-92fd-************',
    authority: 'https://login.microsoftonline.com/789b89ff-a944-4e6f-8c49-************/',
    redirectUri: 'http://localhost:8080',
    validateAuthority: false
  },
  cache: {
    cacheLocation: 'localStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return
        }
        switch (level) {
          case MsalPlugin.LogLevel.Error:
            console.error(message)
            return
          case MsalPlugin.LogLevel.Info:
            console.info(message)
            return
          case MsalPlugin.LogLevel.Verbose:
            console.debug(message)
            return
          case MsalPlugin.LogLevel.Warning:
            console.warn(message)
        }
      }
    }
  }
}

Vue.use(new MsalPlugin(), msalConfig)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
