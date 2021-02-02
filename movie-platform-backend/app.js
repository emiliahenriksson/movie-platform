const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("movie-platform.db");
const bodyParser = require("body-parser");

const jwt = require("jsonwebtoken");
const jwtSecret = "nejgbksjnflsjegngklwngk";
const idTokenSecret = "jkenfwknlkrngenglngengekjrng";

const bcrypt = require("bcryptjs");

app.use(bodyParser.json());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

/**
 *
 * Enable CORS
 *
 */

app.use(function (request, response, next) {
  response.setHeader("Access-Control-Allow-Origin", "*");

  response.setHeader("Access-Control-Allow-Methods", "*");

  response.setHeader("Access-Control-Allow-Headers", "*");

  response.setHeader("Access-Control-Expose-Headers", "*");

  next();
});

/**
 *
 * Creating tables in SQLite database
 *
 */

db.run("PRAGMA foreign_keys = ON");
db.run(`
	CREATE TABLE IF NOT EXISTS accounts (
		id INTEGER PRIMARY KEY,
		username TEXT,
    password TEXT,
    watchedMovies TEXT,
    wantSeeMovies TEXT,
		CONSTRAINT uniqueUsername UNIQUE(username)
  )

`);
db.run(`
  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY,
    title TEXT,
    year INTEGER,
    description TEXT,
    image TEXT
  )
`);
db.run(`
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY,
    authorId INTEGER,
    movieId INTEGER,
    review TEXT,
    rating INTEGER,
    username	TEXT,
	  movieTitle	TEXT,
    FOREIGN KEY('authorId') REFERENCES 'accounts'('id'),
    FOREIGN KEY('movieId') REFERENCES 'movies'('id')
  )
`);

/**
 *
 */
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

/**
 *
 * Access tokens
 *
 */
app.post("/tokens", function (request, response) {
  const grantInfo = request.query;

  if (grantInfo.grant_type != "password") {
    response.status(400).json({ error: "unsupported_grant_type" });
    return;
  }
  if (!grantInfo.username || !grantInfo.password) {
    response.status(400).json({ error: "invalid_request" });
    return;
  }

  const username = grantInfo.username;
  const query = "SELECT * FROM accounts WHERE username = ?";
  const values = [username];
  db.get(query, values, function (error, account) {
    const errors = [];
    if (error) {
      response.status(500).end();
    } else if (!account) {
      errors.push("invalid_client");
      response.status(404).json(errors);
    } else if (bcrypt.compareSync(grantInfo.password, account.password)) {
      const accessToken = jwt.sign(
        {
          accountId: account.id,
          accountUser: account.username,
        },
        jwtSecret
      );
      const idToken = jwt.sign(
        {
          sub: account.id,
          preferred_username: account.username,
        },
        idTokenSecret
      );
      response.status(200).json({
        token_type: "Bearer",
        access_token: accessToken,
        id_token: idToken,
      });
    } else {
      errors.push("wrongCredentials");
      response.status(400).json(errors);
    }
  });
});

/**
 *
 * Accounts
 *
 */

/**
 * Fetch single account
 */
app.get("/accounts/:id", function (request, response) {
  let dataInToken = null;

  try {
    const authorizationHeader = request.get("Authorization");
    const accessToken = authorizationHeader.substr("Bearer ".length);
    dataInToken = jwt.verify(accessToken, jwtSecret);
  } catch (error) {
    const errors = [];
    errors.push("notAuthenticated");
    response.status(401).json(errors);
  }

  if (dataInToken) {
    const id = request.params.id;
    const query = "SELECT * FROM accounts WHERE id = ?";
    const values = [id];
    db.get(query, values, function (error, account) {
      const errors = [];
      if (error) {
        response.status(500).end();
      } else if (!account) {
        errors.push("invalid_client");
        response.status(404).json(errors);
      } else {
        response.status(200).json(account);
      }
    });
  } else {
    const errors = [];
    errors.push("notAuthorized");
    response.status(401).json(errors);
  }
});

/**
 * Create Account
 */
app.post("/accounts", function (request, response) {
  const account = request.body;
  const query = "INSERT INTO accounts (username, password) VALUES (?, ?)";

  const hashingRounds = 8;
  const hashValue = bcrypt.hashSync(account.password, hashingRounds);
  const values = [account.username, hashValue];
  db.run(query, values, function (error) {
    if (error) {
      const errors = [];
      errors.push("usernameTaken");
      response.status(400).json(errors);
    } else {
      const id = this.lastID;
      response.header("Location", "/accounts/" + id);
      response.status(201).json(id);
    }
  });
});

/**
 * Update account: Add movieIds to lists
 */
app.put("/accounts/:id", function (request, response) {
  let dataInToken = null;

  try {
    const authorizationHeader = request.get("Authorization");
    const accessToken = authorizationHeader.substr("Bearer ".length);
    dataInToken = jwt.verify(accessToken, jwtSecret);
  } catch (error) {
    const errors = [];
    errors.push("notAuthenticated");
    response.status(401).json(errors);
  }

  if (dataInToken) {
    const updatedAccount = request.body;
    const id = dataInToken.accountId;
    const query =
      "UPDATE accounts SET watchedMovies = ?, watchLater = ? WHERE id = ?";
    const values = [
      updatedAccount.watchedMovies,
      updatedAccount.watchLater,
      id,
    ];
    db.run(query, values, function (error) {
      if (error) {
        const errors = [];
        errors.push("invalid_client");
        response.status(404).json(errors);
      } else {
        response.status(204).end();
      }
    });
  } else {
    const errors = [];
    errors.push("notAuthorized");
    response.status(401).json(errors);
  }
});

/**
 *
 * Movies
 *
 */

/**
 * Fetching all movies
 */
app.get("/movies", function (request, response) {
  const query = "SELECT * FROM movies ORDER BY title";
  db.all(query, function (error, movies) {
    if (error) {
      response.status(500).end();
    } else {
      response.status(200).json(movies);
    }
  });
});

/**
 * Fetch single movie
 */
app.get("/movies/:id", function (request, response) {
  const id = request.params.id;
  const query = "SELECT * FROM movies WHERE id = ?";
  const values = [id];
  db.get(query, values, function (error, movie) {
    const errors = [];
    if (error) {
      response.status(500).end();
    } else if (!movie) {
      errors.push("couldNotFindMovie");
      response.status(404).json(errors);
    } else {
      response.status(200).json(movie);
    }
  });
});

/**
 *
 * Reviews
 *
 */

app.get("/reviews", function (request, response) {
  const action = request.query;
  /**
   * Fetch review by author
   */
  if (action.authorId) {
    let dataInToken = null;
    try {
      const authorizationHeader = request.get("Authorization");
      const accessToken = authorizationHeader.substr("Bearer ".length);
      dataInToken = jwt.verify(accessToken, jwtSecret);
    } catch (error) {
      const errors = [];
      errors.push("notAuthenticated");
      response.status(401).json(errors);
    }
    if (dataInToken) {
      const authorId = action.authorId;
      const query = "SELECT * FROM reviews WHERE authorId = ? ORDER BY id DESC";
      const values = [authorId];
      db.all(query, values, function (error, review) {
        const errors = [];
        if (error) {
          response.status(500).end();
        } else if (!review) {
          errors.push("invalid_client");
          response.status(404).json(errors);
        } else {
          response.status(200).json(review);
        }
      });
    } else {
      const errors = [];
      errors.push("notAuthorized");
      response.status(401).json(errors);
    }
    /**
     * Fetch review by movieId
     */
  } else if (action.movieId) {
    const movieId = action.movieId;
    const query = "SELECT * FROM reviews WHERE movieId = ? ORDER BY id DESC";
    const values = [movieId];
    db.all(query, values, function (error, review) {
      const errors = [];
      if (error) {
        response.status(500).end();
      } else if (!review) {
        errors.push("couldNotFindReview");
        response.status(404).json(errors);
      } else {
        response.status(200).json(review);
      }
    });
    /**
     * Fetching all reviews
     */
  } else {
    const query = "SELECT * FROM reviews ORDER BY id DESC ";
    db.all(query, function (error, reviews) {
      if (error) {
        response.status(500).end();
      } else {
        response.status(200).json(reviews);
      }
    });
  }
});

/**
 * Create Review
 */
app.post("/reviews", function (request, response) {
  let dataInToken = null;

  try {
    const authorizationHeader = request.get("Authorization");
    const accessToken = authorizationHeader.substr("Bearer ".length);
    dataInToken = jwt.verify(accessToken, jwtSecret);
  } catch (error) {
    const errors = [];
    errors.push("notAuthenticated");
    response.status(401).json(errors);
  }

  if (dataInToken) {
    const reviews = request.body;
    const query =
      "INSERT INTO reviews (authorId, movieId, review, rating, username, movieTitle) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
      reviews.accountId,
      reviews.movieId,
      reviews.review,
      reviews.rating,
      reviews.username,
      reviews.movieTitle,
    ];
    db.run(query, values, function (error) {
      if (error) {
        response.status(500).end();
      } else {
        const id = this.lastID;
        response.header("Location", "/reviews/" + id);
      }
    });
  } else {
    const errors = [];
    errors.push("notAuthorized");
    response.status(401).json(errors);
  }
});

/**
 * Delete review
 */
app.delete("/reviews/:id", function (request, response) {
  let dataInToken = null;

  try {
    const authorizationHeader = request.get("Authorization");
    const accessToken = authorizationHeader.substr("Bearer ".length);
    dataInToken = jwt.verify(accessToken, jwtSecret);
  } catch (error) {
    const errors = [];
    errors.push("notAuthenticated");
    response.status(401).json(errors);
  }
  if (dataInToken) {
    const id = request.params.id;

    const query = "DELETE FROM reviews WHERE id = ?";
    const values = [id];

    db.run(query, values, function (error, review) {
      const errors = [];
      if (error) {
        response.status(500).end();
      } else if (!review) {
        errors.push("couldNotFindReview");
        response.status(404).json(errors);
      } else {
        response.status(200).json(review);
      }
    });
  } else {
    const errors = [];
    errors.push("notAuthorized");
    response.status(401).json(errors);
  }
});

app.listen(3000);
