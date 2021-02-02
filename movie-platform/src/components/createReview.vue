<template>
  <div id="reviews">
    <h1>Create review</h1>
    <form action="">
      <label for="rating">Stars</label>
      <input id="rating" v-model="rating" type="number" />
      <label for="review">Review</label>
      <input id="review" v-model="review" type="text" />
      <button @click="CreateReviewBtn">Create Review</button>
    </form>
    <p v-if="createdReview == true">{{ message }}</p>
  </div>
</template>

<script>
const client = require("../../movie-platform-client");
export default {
  name: "CreateReview",
  data() {
    return {
      user: {
        isSignedIn: false,
        accessToken: "",
        idToken: "",
      },
      movieId: this.$route.params.id,
      review: "",
      rating: "",
      username: "",
      accountId: "",
      movieTitle: "",
      message: "Your review have been added!",
      createdReview: false,
    };
  },
  methods: {
    CreateReviewBtn() {
      const reviews = {
        accountId: Number(this.accountId),
        movieId: Number(this.$route.params.id),
        review: this.review,
        rating: Number(this.rating),
        username: this.username,
        movieTitle: this.movieTitle,
      };

      client.createReview(this.user.accessToken, reviews, (errors, id) => {
        if (errors.length == 0) {
          this.movie = this.movie;
          this.createdReview = true;
        } else {
          console.log(errors);
        }
      });
    },
  },
  created() {
    this.user.isSignedIn = localStorage.signedIn === "true";
    this.username = localStorage.username;
    this.accountId = localStorage.accountId;
    this.user.accessToken = localStorage.accessToken;
    this.user.idToken = localStorage.idToken;

    client.getMovieById(this.movieId, (errors, movie) => {
      if (errors.length == 0) {
        this.movieTitle = movie.title;
      } else {
        console.log(errors);
      }
    });
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
label {
  width: 80px;
  text-align: left;
}

button {
  margin: auto;
  width: 120px;
  height: 30px;
  font-size: 15px;
  border-radius: 10px;
  border: solid 1px #000000;
}
</style>
