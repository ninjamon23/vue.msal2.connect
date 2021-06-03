import * as msal from '@azure/msal-browser'
import Vue from 'vue'
let msalInstance
export let msalPluginInstance
export class MsalPlugin {
  constructor () {
    this.pluginOptions = {}
    this.isAuthenticated = false
  }

  initialize (options) {
    const msalConfig = {
      auth: {
        clientId: options.auth.clientId,
        authority: options.auth.authority,
        redirectUri: options.auth.redirectUri,
        validateAuthority: false
      },
      cache: {
        cacheLocation: options.cache.cacheLocation, // This configures where your cache will be stored
        storeAuthStateInCookie: false // Set this to "true" if you are having issues on IE11 or Edge
      },
      system: {
        loggerOptions: {
          loggerCallback: (level, message, containsPii) => {
            if (containsPii) {
              return
            }
            switch (level) {
              case msal.LogLevel.Error:
                console.error(message)
                return
              case msal.LogLevel.Info:
                console.info(message)
                return
              case msal.LogLevel.Verbose:
                console.debug(message)
                return
              case msal.LogLevel.Warning:
                console.warn(message)
            }
          }
        }
      }
    }

    msalInstance = new msal.PublicClientApplication(msalConfig)
    this.isAuthenticated = this.getIsAuthenticated()
  }

  getIsAuthenticated () {
    const accounts = msalInstance.getAllAccounts()
    return accounts && accounts.length > 0
  }

  install (vue, options) {
    if (!options) {
      throw new Error('MsalPluginOptions must be specified')
    }
    console.log('options>', options)
    this.pluginOptions = options
    this.initialize(options)
    msalPluginInstance = this
    vue.prototype.$msal = Vue.observable(msalPluginInstance)
  }

  async signIn () {
    try {
      const loginRequest = {
        scopes: ['User.Read'],
        redirectUri: this.pluginOptions.redirectUri
      }

      const loginResponse = await msalInstance.loginPopup(loginRequest)
      //   const loginResponse = await msalInstance.loginRedirect(loginRequest)
      this.isAuthenticated = !!loginResponse.account

      const meResponse = await this.callMsGraph('me')
      this.profile = meResponse
      // console.log('meResponse>', meResponse)
    } catch (ex) {
      this.isAuthenticated = false
    }
  }

  async signOut () {
    await msalInstance.logout()
    this.profile = null
    this.isAuthenticated = false
  }

  async getToken () {
    const tokenRequest = {
      account: msalInstance.getAllAccounts()[0]
    }

    try {
    //   console.log('tokenRequest', tokenRequest)
      const response = await msalInstance.acquireTokenSilent(tokenRequest)
      //   console.log('response>', response)
      return { result: true, response }
    } catch (error) {
      if (error instanceof msal.InteractionRequiredAuthError) {
        return msalInstance.acquireTokenPopup(tokenRequest).catch((popupError) => {
          console.error(popupError)
        })
      }
      return { result: false, response: null }
    }
  }

  /**
   * Call MS Graph
   * For more details please check it on https://docs.microsoft.com/en-us/graph/use-the-api
   * @param {String} endpoint
   * @returns
   */
  async callMsGraph (endpoint, responseType) {
    const baseEndpoint = `https://graph.microsoft.com/v1.0/${endpoint}`
    const tokenResponse = await this.getToken()
    // console.log('tokenResponse>', tokenResponse)
    // console.log('tokenResponse.accessToken>', tokenResponse.response.accessToken)
    const headers = new Headers()
    const bearer = `Bearer ${tokenResponse.response.accessToken}`
    headers.append('Authorization', bearer)
    // headers.append('Content-Type','application/json')
    const options = {
      method: 'GET',
      headers: headers
    }
    return fetch(baseEndpoint, options)
      .then(response => {
        if (responseType) {
          switch (responseType) {
            case 'blob':
              return response.blob()
          }
        }
        return response.json()
      })
      .catch(error => console.log(error))
  }
}
