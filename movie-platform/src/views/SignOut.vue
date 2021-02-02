<template>
  <div class="signOut">
    <h1>You have been signed out</h1>
  </div>
</template>

<script>
export default {
  props: ["user"],
  created() {
    /**
     * Resets user informaton to empty strings to forget about access- and id tokens
     */
    this.user.isSignedIn = false;
    localStorage.signedIn = false;
    this.user.username = "";
    localStorage.username = "";
    this.user.accountId = "";
    localStorage.accountId = "";
    this.user.accessToken = "";
    localStorage.accessToken = "";
    this.user.idToken = "";
    localStorage.idToken = "";
  },
};
</script>
