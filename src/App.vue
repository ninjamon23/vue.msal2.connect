<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
      <hr>
      <button @click="login">Login</button>
      <button @click="logout">Logout</button>
      <button @click="getToken">Get Token</button>
      <button @click="callGraph">Call MS Graph</button>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  computed: {
    isAuthenticated () {
      return this.$msal.isAuthenticated
    }
  },
  methods: {
    login () {
      this.$msal.signIn()
    },
    logout () {
      this.$msal.signOut()
    },
    async getToken () {
      const token = await this.$msal.getToken()
      console.log('token', token)
    },
    async callGraph () {
      const graphResult = await this.$msal.callMsGraph('me')
      console.log('graphResult', await Promise.resolve(graphResult))

      const graphResult2 = await this.$msal.callMsGraph('me/photos')
      console.log('graphResult2', graphResult2)
    }
  },
  async mounted () {
    if (!this.$msal.isAuthenticated) {
      this.login()
    }
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
