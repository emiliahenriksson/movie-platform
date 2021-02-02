<template>
  <div id="watchedMovies">
    <h1>Watched Movies</h1>
    <div id="movieList">
      <div
        class="movieImg"
        v-for="index in watchedMoviesList.slice(0, 10)"
        :key="index.id"
      >
        <router-link :to="'/one-movie/' + index.id">
          <img :src="getSrc(index.image)" :alt="index.title" />
        </router-link>
      </div>
    </div>
    <router-view :user="user" />
  </div>
</template>

<script>
const client = require("../../movie-platform-client");

export default {
  name: "WatchedMovies",
  data() {
    return {
      user: {
        isSignedIn: false,
        username: "",
        accountId: "",
        accessToken: "",
        idToken: "",
      },
      movies: "",
      authorId: this.$route.params.id,
      watchedMovies: [],
      watchedMoviesList: [],
    };
  },
  methods: {
    getSrc(name) {
      let images = require.context("../assets/movie-img/", false, /\.jpg$/);
      return images("./" + name);
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
#movieList {
  width: 400px;
  display: flex;
  flex-wrap: wrap;
}

.movieImg img {
  width: 80px;
  height: 120px;
  object-fit: cover;
  margin: 0px;
  padding: 0px;
  display: block;
}

h1 {
  text-align: left;
}
</style>
