<template>
  <div id="signUp">
    <h1>Create Account</h1>
    <form action="">
      <label for="username">Username:</label>
      <input id="username" v-model="username" type="text" />
      <label for="password">Password:</label>
      <input id="password" v-model="password" type="password" />
      <button @click="createAccount">Create Account</button>
    </form>
    <p v-if="error == true" class="errorMsg">Username is already taken</p>
    <p>
      Already have an account? <router-link to="/sign-in">Sign In!</router-link>
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
  methods: {
    createAccount() {
      const account = {
        username: this.username,
        password: this.password,
      };

      client.createAccount(account, (errors, id) => {
        if (errors.length == 0) {
          window.location.href = "#/sign-in";
        } else {
          console.log(errors);
          this.error = true;
        }
      });
    },
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
