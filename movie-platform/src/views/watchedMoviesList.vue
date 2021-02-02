<template>
  <div id="watchedMoviesList">
    <h1>{{ account.username }}'s Watched Movies List</h1>
    <div id="movieList">
      <div
        class="movieImg"
        v-for="index in watchedMoviesList.slice(0, 10)"
        :key="index.id"
      >
        <router-link :to="'/one-movie/' + index.id">
          <img :src="getSrc(index.image)" :alt="index.title" />
          <h2>{{ index.title }}</h2>
        </router-link>
        <button @click="deleteBtn(index.id)">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
const client = require("../../movie-platform-client");

export default {
  name: "WatchedMovies",
  data() {
    return {
      movies: "",
      authorId: this.$route.params.id,
      watchedMovies: [],
      watchedMoviesList: [],
      account: "",
    };
  },
  props: ["user"],
  methods: {
    /**
     * Method to access images when looping through array
     */
    getSrc(name) {
      let images = require.context("../assets/movie-img/", false, /\.jpg$/);
      return images("./" + name);
    },
    /**
     * Method to delete added movie
     */
    deleteBtn(id) {
      for (let i = 0; i < this.watchedMovies.length; i++) {
        if (this.watchedMovies[i] == id) {
          this.watchedMovies.splice(i, 1);
        }
      }
      this.watchedMovies = this.watchedMovies.join(", ");

      const removeFromList = {
        watchedMovies: this.watchedMovies,
        watchLater: this.account.watchLater,
      };
      /**
       * Updates account with the new list
       */
      client.updateAccountById(
        this.user.idToken,
        this.user.accessToken,
        removeFromList,
        (errors) => {
          if (errors.length == 0) {
          } else {
          }
        }
      );
      location.reload();
    },
  },
  created() {
    this.user.isSignedIn = localStorage.signedIn === "true";
    this.user.username = localStorage.username;
    this.user.accountId = localStorage.accountId;
    this.user.accessToken = localStorage.accessToken;
    this.user.idToken = localStorage.idToken;

    client.getAccountById(
      this.user.idToken,
      this.user.accessToken,
      (errors, account) => {
        if (errors.length == 0) {
          this.account = account;
          if (account.watchedMovies != undefined) {
            this.watchedMovies = account.watchedMovies.split(", ");
          }

          /**
           * get all movies
           */
          client.getAllMovies((errors, movies) => {
            if (errors.length == 0) {
              this.movies = movies;
            } else {
              console.log(errors);
            }

            this.watchedMoviesList = [];
            for (let i = 0; i < this.movies.length; i++) {
              for (let a = 0; a < this.watchedMovies.length; a++) {
                if (this.movies[i].id == this.watchedMovies[a]) {
                  this.watchedMoviesList.push(this.movies[i]);
                }
              }
            }
          });
        } else {
          console.log(errors);
        }
      }
    );
  },
};
</script>

<style scoped>
img {
  width: 150px;
  height: 225px;
  object-fit: cover;
  border: solid 0.2px rgb(243, 243, 243);
}

#movieList {
  display: flex;
  max-width: 100vw;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 1040px;
  margin: auto;
}

#movieList div {
  width: 150px;
}

button {
  margin: 0 20px 20px 20px;
  padding: 5px 10px;
  width: 70px;
}
</style>
