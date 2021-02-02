<template>
  <div class="home">
    <h1>Recent Reviews</h1>
    <div id="movie-reviews">
      <ul>
        <li v-for="index in reviews.slice(0, 10)" :key="index.id">
          <div class="reviewRating">
            <p>
              <b>{{ index.username }}</b> rated <b>{{ index.movieTitle }}</b>
              {{ index.rating }} stars
            </p>
          </div>
          <div class="reviewReview">
            <p>{{ index.review }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

const client = require("../../movie-platform-client");

export default {
  data() {
    return {
      reviews: "",
    };
  },
  created() {
    client.getAllReviews((errors, reviews) => {
      if (errors.length == 0) {
        this.reviews = reviews;
      } else {
        console.log(errors);
      }
    });
  },
};
</script>

<style scoped>
#movie-reviews li {
  border: solid 1px #000;
  list-style: none;
  width: 500px;
  margin: 25px auto;
  text-align: left;
}
#movie-reviews li p {
  margin: 20px;
  font-size: 20px;
}

#movie-reviews li .reviewReview p {
  font-style: italic;
  margin-top: 20px;
}
</style>
