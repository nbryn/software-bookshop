// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

// Models
const { User } = require("./models/user");
const { Author } = require("./models/author");
const { Book } = require("./models/book");

// Middleware
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { isAuth } = require("./middleware/isAuth");
const { isAdmin } = require("./middleware/isAdmin");

// Database connection
mongoose.connect(process.env.DATABASE);
// Extract body of incoming request stream and expose it on request.body
app.use(bodyParser.urlencoded({ extended: true }));
// Only JSON format
app.use(bodyParser.json());
// Parse cookie header
app.use(cookieParser());
// Allow cors
app.use(cors());

// ------------------------------- USERS ------------------------------ //

// Authentication => true/false => next => request, response
app.get("/webshop/users/auth", isAuth, (request, response) => {
  response.status(200).json({
    admin: request.user.role === 0 ? false : true,
    authenticated: true,
    role: request.user.role,
    email: request.user.email,
    fullName: request.user.lastName,
    history: request.user.history,
    cart: request.user.cart
  });
});

// SignUp
app.post("/webshop/users/signup", (request, response) => {
  const user = new User(request.body);
  // Persist User => Error handling
  try {
    user.save((error, document) => {
      return response.status(200).json({
        completed: true
      });
    });
  } catch (error) {
    response.status(400).json({
      completed: false,
      error
    });
  }
});

// SignIn
app.post("/webshop/users/signin", (request, response) => {
  // Locate email in Database
  User.findOne({ email: request.body.email }, (error, user) => {
    if (!user) {
      return response.status(400).json({
        completed: false,
        message: "No such email"
      });
    } else {
      // Compare user input with password in Database
      user.verifyPassword(request.body.password, (error, match) => {
        if (!match) {
          return response.status(401).json({
            completed: false,
            message: "Email and password does not match"
          });
        } else {
          user.createToken((error, user) => {
            if (error) {
              return response.status(200).send(error);
            } else {
              // Set cookie value = token & confirm login
              response
                .cookie("authorized", user.token)
                .status(200)
                .json({
                  completed: true
                });
            }
          });
        }
      });
    }
  });
});

// SignOut
app.get("/webshop/users/signout", isAuth, (request, response) => {
  // Check if user is signed in
  try {
    User.findOneAndUpdate({ _id: request.user._id }, { token: "" }, () => {
      return response.status(400).json({
        completed: true
      });
    });
  } catch (error) {
    return response.status(404).json({
      completed: false
    });
  }
});

// ------------------------------- AUTHORS ------------------------------ //

// Persist Author
app.post("/webshop/book/author", isAuth, isAdmin, (request, response) => {
  let author = new Author(request.body);

  try {
    author.save((error, author) => {
      return response.status(200).json({
        completed: true,
        author: author
      });
    });
  } catch (error) {
    return response.sendStatus(404).json({
      completed: false
    });
  }
});

// Find all Authors
app.get("/webshop/book/authors", isAuth, (request, response) => {
  try {
    Author.find({}, (error, authors) => {
      response.status(200).send(authors);
    });
  } catch (error) {
    return response.status(404).json({
      completed: false
    });
  }
});

// ------------------------------- BOOKS ------------------------------ //

// Persist Book
app.post("/webshop/book", isAuth, isAdmin, (request, response) => {
  let book = new Book(request.body);

  try {
    book.save((error, book) => {
      return response.status(200).json({
        completed: true,
        book: book
      });
    });
  } catch (error) {
    return response.status(404).json({
      completed: false
    });
  }
});

// Get Book(s) by id - e.g. /webshop/book_by_id?id=xxx&type=xxx
app.get("/webshop/book_by_id", (request, response) => {
  let items, ids;
  let type = request.query.type;
  // Convert String to Array of Books
  if (type === "array") {
    ids = request.query.id.split(",");
    items = ids.map(id => {
      return mongoose.Types.ObjectId(id);
    });
  }

  // Get Book(s) from Database and populate author field with actual author
  try {
    Book.find({ _id: { $in: items } })
      .populate("author")
      .exec((error, books) => {
        return response.status(200).send(books);
      });
  } catch (error) {
    return response.status(404).json({
      completed: false
    });
  }
});

// Get most purchased book(s) - e.g. "/webshop/book_by_sold?sortBy=purchased&order=desc&limit=4"
app.get("/webshop/book_by_sold", (request, response) => {
  // Default values if not present in query
  let order = request.query.order ? request.query.order : "asc";
  let sortBy = request.query.sortBy ? request.query.sortBy : "_id";
  let limit = request.query.limit ? parseInt(request.query.limit) : 80;

  try {
    Book.find()
      .populate("author")
      .sort([[sortBy, order]])
      .limit(limit)
      .exec((error, books) => {
        return response.status(200).send(books);
      });
  } catch (error) {
    return response.status(404).json({
      completed: false
    });
  }
});

// Localhost Port
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server @ ${port}`);
});
