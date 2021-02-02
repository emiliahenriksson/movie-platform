<template>
  <div id="watchLaterMovies">
    <h1>Watch Later</h1>
    <div id="movieList">
      <div
        class="movieImg"
        v-for="index in watchLaterList.slice(0, 10)"
        :key="index.id"
      >
        <router-link :to="'/one-movie/' + index.id">
          <img :src="getSrc(index.image)" :alt="index.title" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
const client = require("../../movie-platform-client");

export default {
  name: "WatchLater",
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
      watchLater: [],
      watchLaterList: [],
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
    this.user.accessToken = localStorage.accessToken;
    this.user.idToken = localStorage.idToken;

    client.getAccountById(
      this.user.idToken,
      this.user.accessToken,
      (errors, account) => {
        if (errors.length == 0) {
          this.account = account;
          if (account.watchLater != undefined) {
            this.watchLater = account.watchLater.split(", ");
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

            this.watchLaterList = [];
            for (let i = 0; i < this.movies.length; i++) {
              for (let a = 0; a < this.watchLater.length; a++) {
                if (this.movies[i].id == this.watchLater[a]) {
                  this.watchLaterList.push(this.movies[i]);
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
  height: 240px;
  display: flex;
  flex-wrap: wrap;
}

.movieImg img {
  width: 80px;
  height: 120px;
  object-fit: cover;
  display: block;
}

h1 {
  text-align: left;
}
</style>
