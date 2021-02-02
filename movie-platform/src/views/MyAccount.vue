<template>
  <div id="my-account">
    <div id="profile">
      <img src="../assets/profilePic.jpeg" alt="profilepic" />
      <div class="profileDetails">
        <h1>{{ account.username }}</h1>
        <div id="profileStats">
          <div class="stats">
            <h2>{{ statsReview }}</h2>
            <p>Reviews</p>
          </div>
          <div class="stats">
            <h2>{{ statsWatched }}</h2>
            <p>Watched</p>
          </div>
          <div class="stats">
            <h2>{{ statsLater }}</h2>
            <p>Watch Later</p>
          </div>
        </div>
      </div>
    </div>
    <div id="mainContent">
      <div id="movie-reviews">
        <h1>Reviews</h1>
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
            <button @click="deleteReviewBtn(index.id)">Delete</button>
          </li>
        </ul>
      </div>
      <div id="movieLists">
        <router-link :to="'/my-account/watched-movies/' + authorId">
          <div id="watchedMoviesList">
            <WatchedMovies />
          </div>
        </router-link>
        <router-link :to="'/my-account/watch-later/' + authorId">
          <div id="watchLaterList">
            <WatchLater />
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import WatchedMovies from "@/components/watchedMovies.vue";
import WatchLater from "@/components/watchLaterMovies.vue";
const client = require("../../movie-platform-client");
export default {
  components: {
    WatchedMovies,
    WatchLater,
  },
  props: ["user"],
  data() {
    return {
      authorId: this.$route.params.id,
      review: "",
      account: "",
      statsReview: "",
      statsWatched: "",
      statsLater: "",
    };
  },
  methods: {
    deleteReviewBtn(id) {
      client.deleteReview(this.user.accessToken, id, (errors, review) => {
        if (errors.length == 0) {
          id = review;
        } else {
          console.log(errors);
        }
      });

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
            this.statsWatched = account.watchedMovies.split(",").length - 1;
          } else {
            this.statsWatched = "0";
          }
          if (account.watchLater != undefined) {
            this.statsLater = account.watchLater.split(", ").length - 1;
          } else {
            this.statsLater = "0";
          }
        } else {
          console.log(errors);
        }
      }
    );

    client.getReviewByAuthor(
      this.user.idToken,
      this.user.accessToken,
      (errors, review) => {
        if (errors.length == 0) {
          this.review = review;
          this.statsReview = review.length;
        } else {
          console.log(errors);
        }
      }
    );
  },
};
</script>

<style scoped>
button {
  margin: 0 20px 20px 20px;
  padding: 5px 10px;
}

#mainContent {
  display: flex;
  width: 1000px;
  margin: auto;
  justify-content: space-between;
}

#mainContent h1 {
  text-align: left;
}

#movieLists div {
  margin-bottom: 50px;
}

ul {
  padding: 0;
}

#profile img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
}

#profile .profileDetails {
  width: 300px;
  margin: 20px auto;
}
#profileStats {
  display: flex;
}
.stats {
  width: 100px;
}
.stats h2 {
  font-size: 40px;
  margin: 0;
}

.stats p {
  margin: 0;
}

#profile h1 {
  margin: 0px 0px 10px 0px;
  font-size: 35px;
}

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
