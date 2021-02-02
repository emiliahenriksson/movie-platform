const jwtDecode = require("jwt-decode").default;

/**
 *
 * Authorization
 *
 */

/**
 * Sign in
 */
module.exports.signIn = function(username, password, callback) {
  const request = new XMLHttpRequest();

  const bodyToSend = {
    username: username,
    password: password,
    grant_type: "password",
  };

  request.open(
    "POST",
    "http://localhost:3000/tokens?username=" +
      bodyToSend.username +
      "&password=" +
      bodyToSend.password +
      "&grant_type=password",
    "application/x-www-form-urlencoded"
  );

  request.setRequestHeader("Content-Type", "application/json");

  request.addEventListener("load", function() {
    const statusCode = request.status;
    const bodyAsString = request.responseText;
    const bodyAsJsObject = JSON.parse(bodyAsString);

    let errors = [];
    switch (statusCode) {
      case 200:
        const idToken = bodyAsJsObject.id_token;
        const dataInIdToken = jwtDecode(idToken);
        const accountId = dataInIdToken.sub;
        callback(errors, bodyAsJsObject, accountId);
        break;

      case 400:
        if (bodyAsJsObject.error == "unsupported_grant_type") {
          errors = ["unsupportedGrantType"];
        } else {
          errors = ["wrongCredentials"];
        }
        callback(errors);
        break;

      case 404:
        errors = ["wrongCredentials"];
        callback(errors);
        break;
    }
  });

  request.addEventListener("error", function() {
    const errors = ["backendError"];
    callback(errors);
  });

  request.send();
};

/**
 *
 * Accounts
 *
 */

/**
 * Get account by id
 */
module.exports.getAccountById = function(idToken, accessToken, callback) {
  const request = new XMLHttpRequest();

  const dataInIdToken = jwtDecode(idToken);
  request.open(
    "GET",
    "http://localhost:3000/accounts/" + dataInIdToken.accountId
  );

  request.setRequestHeader("Content-Type", "application/json");
  request.setRequestHeader("Authorization", "Bearer " + accessToken);

  request.addEventListener("load", function() {
    const statusCode = request.status;
    const bodyAsString = request.responseText;
    const bodyAsJsObject = JSON.parse(bodyAsString);

    let errors = [];
    switch (statusCode) {
      case 200:
        callback(errors, bodyAsJsObject);
        break;

      case 401:
        errors = bodyAsJsObject;
        callback(errors);
        break;

      case 404:
        errors = bodyAsJsObject;
        callback(errors);
        break;
    }
  });

  request.addEventListener("error", function() {
    const errors = ["backendError"];
    callback(errors);
  });

  request.send();
};

/**
 * Create Account
 */
module.exports.createAccount = function(account, callback) {
  const request = new XMLHttpRequest();

  request.open("POST", "http://localhost:3000/accounts");

  request.setRequestHeader("Content-Type", "application/json");

  request.addEventListener("load", function() {
    const statusCode = request.status;
    const bodyAsString = request.responseText;
    const bodyAsJsObject = JSON.parse(bodyAsString);
    const locationHeader = request.getResponseHeader("Location");

    let errors = [];
    switch (statusCode) {
      case 201:
        callback(errors, bodyAsString);
        break;

      case 400:
        errors = bodyAsJsObject;
        callback(errors);
        break;
    }
  });

  request.addEventListener("error", function() {
    const errors = ["backendError"];
    callback(errors);
  });

  const bodyAsString = JSON.stringify(account);
  request.send(bodyAsString);
};

/**
 * Update account
 */
module.exports.updateAccountById = function(
  idToken,
  accessToken,
  addToList,
  callback
) {
  const request = new XMLHttpRequest();
  const dataInIdToken = jwtDecode(idToken);

  request.open(
    "PUT",
    "http://localhost:3000/accounts/" + dataInIdToken.accountId
  );

  request.setRequestHeader("Content-Type", "application/json");
  request.setRequestHeader("Authorization", "Bearer " + accessToken);

  request.addEventListener("load", function() {
    const statusCode = request.status;
    const bodyAsString = request.responseText;
    const bodyAsJsObject = JSON.parse(bodyAsString);

    let errors = [];
    switch (statusCode) {
      case 204:
        callback(errors, bodyAsString);
        break;

      case 401:
        errors = bodyAsJsObject;
        callback(errors);
        break;

      case 404:
        errors = bodyAsJsObject;
        callback(errors);
        break;
    }
  });

  request.addEventListener("error", function() {
    const errors = ["backendError"];
    callback(errors);
  });

  const bodyAsString = JSON.stringify(addToList);
  request.send(bodyAsString);
};

/**
 *
 * Movies
 *
 */

/**
 * Get all movies
 */
module.exports.getAllMovies = function(callback) {
  const request = new XMLHttpRequest();

  request.open("GET", "http://localhost:3000/movies");

  request.setRequestHeader("Content-Type", "application/json");

  request.addEventListener("load", function() {
    const statusCode = request.status;
    const bodyAsString = request.responseText;
    const bodyAsJsObject = JSON.parse(bodyAsString);

    let errors = [];
    switch (statusCode) {
      case 200:
        callback(errors, bodyAsJsObject);
        break;
    }
  });

  request.addEventListener("error", function() {
    const errors = ["backendError"];
    callback(errors);
  });

  request.send();
};

/**
 * Get movies by id
 */
module.exports.getMovieById = function(id, callback) {
  const request = new XMLHttpRequest();

  request.open("GET", "http://localhost:3000/movies/" + id);

  request.setRequestHeader("Content-Type", "application/json");

  request.addEventListener("load", function() {
    const statusCode = request.status;
    const bodyAsString = request.responseText;
    const bodyAsJsObject = JSON.parse(bodyAsString);

    let errors = [];
    switch (statusCode) {
      case 200:
        callback(errors, bodyAsJsObject);
        break;

      case 404:
        errors = bodyAsJsObject;
        callback(errors);
        break;
    }
  });

  request.addEventListener("error", function() {
    const errors = ["backendError"];
    callback(errors);
  });

  request.send();
};

/**
 *
 * Reviews
 *
 */

/**
 * Get all reviews
 */
module.exports.getAllReviews = function(callback) {
  const request = new XMLHttpRequest();

  request.open("GET", "http://localhost:3000/reviews");

  request.setRequestHeader("Content-Type", "application/json");

  request.addEventListener("load", function() {
    const statusCode = request.status;
    const bodyAsString = request.responseText;
    const bodyAsJsObject = JSON.parse(bodyAsString);

    let errors = [];
    switch (statusCode) {
      case 200:
        callback(errors, bodyAsJsObject);
        break;
    }
  });

  request.addEventListener("error", function() {
    const errors = ["backendError"];
    callback(errors);
  });

  request.send();
};

/**
 * Get review by author
 */
module.exports.getReviewByAuthor = function(idToken, accessToken, callback) {
  const request = new XMLHttpRequest();
  const dataInIdToken = jwtDecode(idToken);

  request.open(
    "GET",
    "http://localhost:3000/reviews?authorId=" + dataInIdToken.accountId
  );
  request.setRequestHeader("Authorization", "Bearer " + accessToken);
  request.setRequestHeader("Content-Type", "application/json");

  request.addEventListener("load", function() {
    const statusCode = request.status;
    const bodyAsString = request.responseText;
    const bodyAsJsObject = JSON.parse(bodyAsString);

    let errors = [];
    switch (statusCode) {
      case 200:
        callback(errors, bodyAsJsObject);
        break;

      case 401:
        errors = bodyAsJsObject;
        callback(errors);
        break;

      case 404:
        errors = bodyAsJsObject;
        callback(errors);
        break;
    }
  });

  request.addEventListener("error", function() {
    const errors = ["backendError"];
    callback(errors);
  });

  request.send();
};

/**
 * Get review by movie
 */
module.exports.getReviewByMovie = function(id, callback) {
  const request = new XMLHttpRequest();

  request.open("GET", "http://localhost:3000/reviews?movieId=" + id);

  request.setRequestHeader("Content-Type", "application/json");

  request.addEventListener("load", function() {
    const statusCode = request.status;
    const bodyAsString = request.responseText;
    const bodyAsJsObject = JSON.parse(bodyAsString);

    let errors = [];
    switch (statusCode) {
      case 200:
        callback(errors, bodyAsJsObject);
        break;

      case 404:
        errors = bodyAsJsObject;
        callback(errors);
        break;
    }
  });

  request.addEventListener("error", function() {
    const errors = ["backendError"];
    callback(errors);
  });

  request.send();
};

/**
 * Create review
 */
module.exports.createReview = function(accessToken, reviews, callback) {
  const request = new XMLHttpRequest();

  request.open("POST", "http://localhost:3000/reviews");
  request.setRequestHeader("Authorization", "Bearer " + accessToken);
  request.setRequestHeader("Content-Type", "application/json");

  request.addEventListener("load", function() {
    const statusCode = request.status;
    const bodyAsString = request.responseText;
    const bodyAsJsObject = JSON.parse(bodyAsString);

    let errors = [];
    switch (statusCode) {
      case 200:
        callback(errors, bodyAsJsObject);
        break;

      case 401:
        errors = bodyAsJsObject;
        callback(errors);
        break;
    }
  });

  request.addEventListener("error", function() {
    const errors = ["backendError"];
    callback(errors);
  });

  let errors = [];

  const bodyAsString = JSON.stringify(reviews);
  request.send(bodyAsString);
  callback(errors);
};

/*
Delete review
*/
module.exports.deleteReview = function(accessToken, id, callback) {
  const request = new XMLHttpRequest();

  request.open("DELETE", "http://localhost:3000/reviews/" + id);

  request.setRequestHeader("Content-Type", "application/json");
  request.setRequestHeader("Authorization", "Bearer " + accessToken);

  request.addEventListener("load", function() {
    const statusCode = request.status;
    const bodyAsString = request.responseText;
    const bodyAsJsObject = JSON.parse(bodyAsString);

    let errors = [];
    switch (statusCode) {
      case 200:
        callback(errors, bodyAsJsObject);
        break;

      case 404:
        errors = bodyAsJsObject;
        callback(errors);
        break;
    }
  });

  request.addEventListener("error", function() {
    const errors = ["backendError"];
    callback(errors);
  });

  request.send();
};
