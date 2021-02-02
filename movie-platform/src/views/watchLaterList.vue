<template>
  <div id="watchedMoviesList">
    <h1>{{ account.username }}'s Watch Later List</h1>
    <div id="movieList">
      <div
        class="movieImg"
        v-for="index in watchLaterList.slice(0, 10)"
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
  data() {
    return {
      movies: "",
      authorId: this.$route.params.id,
      watchLater: [],
      watchLaterList: [],
      account: "",
    };
  },
  props: ["user"],
  methods: {
    getSrc(name) {
      let images = require.context("../assets/movie-img/", false, /\.jpg$/);
      return images("./" + name);
    },
    deleteBtn(id) {
      for (let i = 0; i < this.watchLater.length; i++) {
        if (this.watchLater[i] == id) {
          this.watchLater.splice(i, 1);
        }
      }
      this.watchLater = this.watchLater.join(", ");

      const removeFromList = {
        watchedMovies: this.account.watchedMovies,
        watchLater: this.watchLater,
      };

      client.updateAccountById(
        this.user.idToken,
        this.user.accessToken,
        removeFromList,
        (errors) => {
          if (errors.length == 0) {
          } else {
            console.log(errors);
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
