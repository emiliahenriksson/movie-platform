<template>
  <div id="movies">
    <h1>Create review</h1>
    <button @click="watchedBtn">Have watched</button>
    <button @click="watchLaterBtn">Want to see</button>
    <p v-if="addedMovie == 'added'">{{ message }}</p>
    <p v-else-if="addedMovie == 'exist'">{{ message }}</p>
  </div>
</template>

<script>
const client = require("../../movie-platform-client");
export default {
  name: "AddMovieList",
  data() {
    return {
      user: {
        isSignedIn: false,
        username: "",
        accountId: "",
        accessToken: "",
        idToken: "",
      },
      watchedMovies: "",
      watchLater: "",
      movieId: this.$route.params.id,
      message: "Movie have been added to your list!",
      addedMovie: "false",
    };
  },
  methods: {
    watchLaterBtn() {
      /**
       * Checks if movie is already added
       */
      let duplicate = false;
      if (this.watchLater != null) {
        const checkDuplicate = this.watchLater.split(", ");
        for (let i = 0; i < checkDuplicate.length; i++) {
          if (checkDuplicate[i] == this.movieId) {
            duplicate = true;
            this.message = "This movie have already been added to watch later!";
            this.addedMovie = "exist";
            break;
          }
        }
      }

      /**
       * Adds movie if not added before
       */
      if (!duplicate) {
        const addToList = {
          watchedMovies: this.watchedMovies,
          watchLater: this.watchLater + ", " + this.movieId,
        };
        client.updateAccountById(
          this.user.idToken,
          this.user.accessToken,
          addToList,
          (errors) => {
            if (errors.length == 0) {
            } else {
              console.log(errors);
            }
          }
        );
        this.addedMovie = "added";
      }
    },
    watchedBtn() {
      /**
       * Checks if movie is already added
       */
      let duplicate = false;
      if (this.watchedMovies != null) {
        const checkDuplicate = this.watchedMovies.split(", ");

        for (let i = 0; i < checkDuplicate.length; i++) {
          if (checkDuplicate[i] == this.movieId) {
            duplicate = true;
            this.message =
              "This movie have already been added to watched movies!";
            this.addedMovie = "exist";
            break;
          }
        }
      }

      /**
       * Adds movie if not added before
       */
      if (!duplicate) {
        const addToList = {
          watchedMovies: this.watchedMovies + ", " + this.movieId,
          watchLater: this.watchLater,
        };

        client.updateAccountById(
          this.user.idToken,
          this.user.accessToken,
          addToList,
          (errors) => {
            if (errors.length == 0) {
            } else {
              console.log(errors);
            }
          }
        );
        this.addedMovie = "added";
      }
    },
  },
  created() {
    this.user.isSignedIn = localStorage.signedIn === "true";
    this.user.username = localStorage.username;
    this.user.accountId = localStorage.accountId;
    this.user.accessToken = localStorage.accessToken;
    this.user.idToken = localStorage.idToken;

    /**
     * Accessing users movielists
     */
    client.getAccountById(
      this.user.idToken,
      this.user.accessToken,
      (errors, account) => {
        if (errors.length == 0) {
          this.account = account;
          this.watchedMovies = account.watchedMovies;
          this.watchLater = account.watchLater;
        } else {
          console.log(errors);
        }
      }
    );
  },
};
</script>

<style scoped>
#movies {
  display: flex;
  flex-direction: column;
}

button {
  margin: auto;
  width: 200px;
  font-size: 15px;
  margin-bottom: 20px;
}
</style>
