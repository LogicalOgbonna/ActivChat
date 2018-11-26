const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;
const dblocal = require("./config/keys").mongoLocalURI;

// Connect to MongoDB

// mongoose
//   .connect(db)
//   .then(() => console.log("MongoDB Connected Succesfully"))
//   .catch(error => console.log(error));

mongoose
  .connect(dblocal)
  .then(() => console.log("MongoDB Local Connected Succesfully"))
  .catch(error => console.log(error));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport.js")(passport);

// Use Routes

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Running on PORT ${port}`);
});
