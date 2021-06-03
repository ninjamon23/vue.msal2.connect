# Vue js 2.* wrapper for msal browser 2.*



## Description

A simple Vue js wrapper to make integration to MSAL 2.* version a little bit easier since Microsoft seems to have no plan yet to add VUE js on their official wrapper. This package still has basic features only and probably needs a lot of improvement so help would be so much appreciated.

## Getting Started



### Package Installation
```
npm i vue.msal2.connect
```
### How to use

* Import the plugin and configure the msal options
``` js
import { MsalPlugin } from 'vue.msal2.connect'

const msalConfig = {
  auth: {
    clientId: '73d554dc-cc13-4e1a-92fd-************', // Change this to you client id
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
```
* In your App.vue
```js
export default {
  name: 'App',
  methods: {
    login(){
      this.$msal.signIn()
    },
    logout(){
      this.$msal.signOut()
    }
  },
  created () {
    if(!this.$msal.isAuthenticated){
      this.$msal.signIn()
    }
  }
}
```

#### List of functions
* `signIn()`: Start the sign-in process **manually** 
* `signOut()`: Sign out an authorized user
* `getIsAuthenticated()`: Returns `true` if the user has been authenticated and `false` otherwise.
* `getToken()`: Returns the token info
* `callMsGraph (endpoint, responseType)`: execute a request to the MS Graph 
``` js
this.$msal.callMsGraph('/me')
```
The properties provided in the data object are the following:
* `isAuthenticated`: Is `true` if the user has been successfully authenticated and `false` otherwise. Work in progress to handle all response type.
```js
this.$msal.isAuthenticated
```
* `profile`: return the response from ms graph me endpoint.
```js
this.$msal.profile
```
