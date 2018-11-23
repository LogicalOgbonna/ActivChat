const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Load User Model

const User = require("../../models/User");

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

module.exports = router;
