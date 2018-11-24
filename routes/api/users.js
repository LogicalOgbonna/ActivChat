const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const router = express.Router();

// Load Input Validator
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User Model

const User = require("../../models/User");
const keys = require("../../config/keys");

// @route     GET api/users/test
// @desc      tests user route
// @access    public route
router.get("/test", (req, res) =>
  res.json({
    message: "Users Works"
  })
);

// @route     POST api/users/register
// @desc      Register user route
// @access    public route
router.post("/register", (req, res) => {
  const { errors, isvalid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isvalid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).send({
        email: `Email ${req.body.email} aready Exit`
      });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", //  Rating
        d: "mm" //  Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              res.json(user);
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route     POST api/users/login
// @desc      Login user / Returning JWT Token
// @access    public route
router.post("/login", (req, res) => {
  const { errors, isvalid } = validateLoginInput(req.body);

  // Check Validation
  if (!isvalid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const passwor = req.body.password;

  //Find User by Email
  User.findOne({ email }).then(user => {
    //Check for User
    if (!user) {
      return res
        .status(404)
        .send({ email: `The User with email ${email} was not found` });
    }

    // Check Password
    bcrypt.compare(passwor, user.password).then(isMatch => {
      if (isMatch) {
        // User Password Matched

        // Create JWT payload
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        };

        // Sign Token
        jwt.sign(
          payload,
          keys.secreteKey,
          { expiresIn: "1h" },
          (err, token) => {
            res.json({
              succes: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res.status(400).json({
          password: `The password for the Email ${email} is incorrect`
        });
      }
    });
  });
});

// @route     GET api/users/current
// @desc      Returns the current user the token belongs to
// @access    private route
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      date: req.user.date
    });
  }
);

module.exports = router;
