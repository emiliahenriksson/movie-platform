<template>
  <div id="app">
    <div id="nav">
      <div>
        <router-link to="/">Home</router-link> |
        <router-link to="/all-movies">All movies</router-link>
      </div>
      <div v-if="!user.isSignedIn">
        <router-link to="/signup">Sign Up</router-link>
        <router-link to="/sign-in">Sign In</router-link>
      </div>
      <div v-else>
        <router-link :to="'/my-account/' + user.accountId"
          >My Account</router-link
        >
        <router-link to="/sign-out">Sign Out</router-link>
      </div>
    </div>

    <router-view :user="user" />
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      user: {
        isSignedIn: false,
        username: "",
        accountId: "",
        accessToken: "",
        idToken: "",
      },
    };
  },
  created() {
    this.user.isSignedIn = localStorage.signedIn === "true";
    this.user.username = localStorage.username;
    this.user.accountId = localStorage.accountId;
    this.user.accessToken = localStorage.accessToken;
    this.user.idToken = localStorage.idToken;
  },
};
</script>

<style>
a {
  text-decoration: none;
  color: #2c3e50;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  text-align: left;
  margin-bottom: 50px;
}
#nav div {
  float: left;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  padding: 15px;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
