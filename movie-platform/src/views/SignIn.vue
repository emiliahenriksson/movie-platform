<template>
  <div id="signIn">
    <h1>Sign Into Account</h1>
    <form action="">
      <label for="username">Username:</label>
      <input id="username" v-model="username" type="text" />
      <label for="password">Password:</label>
      <input id="password" v-model="password" type="password" />
      <button @click="signInBtn">Sign In</button>
    </form>
    <p v-if="error == true" class="errorMsg">Wrong password or username</p>
    <p>
      Don't have an account? <router-link to="/signup">Create one!</router-link>
    </p>
  </div>
</template>

<script>
const client = require("../../movie-platform-client");

export default {
  data() {
    return {
      username: "",
      password: "",
      error: false,
    };
  },
  props: ["user"],
  methods: {
    signInBtn() {
      const username = this.username;
      const password = this.password;

      client.signIn(username, password, (errors, account, id) => {
        if (errors.length == 0) {
          /**
           * Saves in local storage so that the application remembers
           * the access token and user information until he logs out
           */
          this.user.isSignedIn = true;
          localStorage.signedIn = true;
          this.user.username = this.username;
          localStorage.username = this.username;
          this.user.accountId = id;
          localStorage.accountId = id;
          this.user.accessToken = account.access_token;
          localStorage.accessToken = account.access_token;
          this.user.idToken = account.access_token;
          localStorage.idToken = account.access_token;

          window.location.href = "#/my-account/" + id;
        } else {
          console.log(errors);
          this.error = true;
        }
      });
    },
  },
  created() {
    this.user.isSignedIn = localStorage.signedIn === "true";
    this.user.username = localStorage.signedInUser;
    this.user.accountId = localStorage.signedInUserId;
  },
};
</script>

<style scoped>
form {
  display: flex;
  width: 300px;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: auto;
}

input {
  width: 200px;
  height: 22px;
  margin-bottom: 20px;
}

button {
  margin: auto;
  width: 120px;
  height: 30px;
  font-size: 15px;
  border-radius: 10px;
  border: solid 1px #000000;
}

a {
  text-decoration: underline;
}

.errorMsg {
  color: red;
}
</style>
