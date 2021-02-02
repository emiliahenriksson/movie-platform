<template>
  <div id="movie">
    <div id="overview">
      <div class="movieDetails">
        <img :src="getSrc(movie.image)" :alt="movie.title" />
        <div class="movie-text">
          <h1>{{ movie.title }}</h1>
          <p>{{ movie.description }}</p>
        </div>
      </div>
      <div class="movie-rating">
        <div class="rating-stars">
          <img src="../assets/star.svg" alt="" />
          <p>{{ average }}</p>
        </div>
        <div v-if="user.isSignedIn" class="rating-buttons">
          <button @click="createReviewBtn">Review</button>
          <button @click="addMovieBtn">Add movie</button>
        </div>
      </div>
    </div>
    <div v-bind:style="{ display: reviewShow }" id="createReview">
      <button @click="closeBtn">X</button>
      <CreateReview />
    </div>
    <div v-bind:style="{ display: listShow }" id="addMovieList">
      <button @click="closeBtn">X</button>
      <AddMovieList />
    </div>
    <div id="movie-reviews">
      <ul>
        <li v-for="index in review" :key="index.id">
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
import CreateReview from "@/components/createReview.vue";
import AddMovieList from "@/components/addMovieList.vue";
const client = require("../../movie-platform-client");

export default {
  components: {
    CreateReview,
    AddMovieList,
  },
  data: {},
  data() {
    return {
      movieId: this.$route.params.id,
      movie: "",
      reviewShow: "none",
      listShow: "none",
      review: "",
      username: "",
      average: "",
    };
  },
  props: ["user"],
  methods: {
    getSrc(name) {
      let images = require.context("../assets/movie-img/", false, /\.jpg$/);
      return images("./" + name);
    },
    createReviewBtn() {
      this.reviewShow = "block";
    },
    addMovieBtn() {
      this.listShow = "block";
    },
    closeBtn() {
      this.reviewShow = "none";
      this.listShow = "none";
      window.location.reload();
    },
  },
  created() {
    this.user.isSignedIn = localStorage.signedIn === "true";
    this.user.username = localStorage.username;
    this.user.accountId = localStorage.accountId;
    this.user.accessToken = localStorage.accessToken;
    this.user.idToken = localStorage.idToken;

    client.getMovieById(this.movieId, (errors, movie) => {
      if (errors.length == 0) {
        this.movie = movie;
      } else {
        console.log(errors);
      }
    });

    client.getReviewByMovie(this.movieId, (errors, review) => {
      if (errors.length == 0) {
        /**
         * Calculate average rating of movie
         */
        this.review = review;
        let average = 0;
        for (let i = 0; i < this.review.length; i++) {
          average = average + this.review[i].rating;
        }
        this.average = average / this.review.length;
        this.average = this.average.toFixed(2);
        if (this.average == "NaN") {
          this.average = "?";
        }
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

#createReview,
#addMovieList {
  width: 800px;
  height: 500px;
  background: #ffffff;
  border: solid 1px #000;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
}

#createReview button,
#addMovieList button {
  margin: 10px;
  position: absolute;
  right: 0px;
}

#overview {
  display: flex;
  justify-content: space-between;
  width: 900px;
  margin: auto;
}

.movieDetails {
  width: 600px;
  display: flex;
}
.movie-rating {
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.movieDetails img {
  width: 200px;
  margin-right: 20px;
}

h1 {
  margin-top: 20px;
}

.movie-text {
  text-align: left;
}

.rating-stars {
  height: 20px;
  display: flex;
  justify-content: flex-end;
}
.rating-stars img {
  height: 35px;
  width: auto;
  margin-top: 22px;
  margin-right: 10px;
}
.rating-stars p {
  font-size: 2em;
  font-weight: bold;
  margin-top: 20px;
}

.rating-buttons {
  display: flex;
  justify-content: flex-end;
}

.rating-buttons button {
  height: 30px;
  width: 100px;
  font-size: 15px;
  border-radius: 15px;
  margin-left: 10px;
}
</style>
