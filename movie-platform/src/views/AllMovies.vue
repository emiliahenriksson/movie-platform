<template>
  <div id="allMovies">
    <h1>Movies</h1>
    <div id="movies">
      <div v-for="index in movies" :key="index.id">
        <router-link :to="'/one-movie/' + index.id">
          <img :src="getSrc(index.image)" :alt="index.title" />
          <h2>{{ index.title }}</h2>
        </router-link>
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
    };
  },
  methods: {
    getSrc(name) {
      let images = require.context("../assets/movie-img/", false, /\.jpg$/);
      return images("./" + name);
    },
  },
  created() {
    client.getAllMovies((errors, movies) => {
      if (errors.length == 0) {
        this.movies = movies;
      } else {
        console.log(errors);
      }
    });
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

#movies {
  display: flex;
  max-width: 100vw;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 1040px;
  margin: auto;
}

#movies div {
  width: 150px;
}
</style>
