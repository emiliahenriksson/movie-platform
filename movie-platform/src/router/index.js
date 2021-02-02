import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },

  {
    path: "/signup",
    name: "Sign Up",
    component: function() {
      return import("../views/SignUp.vue");
    },
  },

  {
    path: "/all-movies",
    name: "AllMovies",
    component: function() {
      return import("../views/AllMovies.vue");
    },
  },
  {
    path: "/one-movie/:id",
    name: "OneMovie",
    component: function() {
      return import("../views/OneMovie.vue");
    },
  },
  {
    path: "/my-account/:id",
    name: "MyAccount",
    component: function() {
      return import("../views/MyAccount.vue");
    },
  },
  {
    path: "/my-account/watched-movies/:id",
    name: "Watched Movies",
    component: function() {
      return import("../views/watchedMoviesList.vue");
    },
  },
  {
    path: "/my-account/watch-later/:id",
    name: "Watch Later",
    component: function() {
      return import("../views/watchLaterList.vue");
    },
  },
  {
    path: "/sign-in",
    name: "Sign In",
    component: function() {
      return import("../views/SignIn.vue");
    },
  },
  {
    path: "/sign-out",
    name: "Sign Out",
    component: function() {
      return import("../views/SignOut.vue");
    },
  },
];

const router = new VueRouter({
  routes,
});

export default router;
