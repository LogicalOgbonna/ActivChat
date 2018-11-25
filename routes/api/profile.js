const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

const router = express.Router();

// Load Profile Model
const Profile = require("../../models/Profile");

// Load User Model
const User = require("../../models/User");

// Load Profile Validation
const validateProfileInput = require("../../validation/profile");

//Load Experience validation
const validateExperienceInput = require("../../validation/experience");

//Load Education validation
const validateEducationInput = require("../../validation/education");

// @route     GET api/profile/test
// @desc      tests profile route
// @access    public route
router.get("/test", (req, res) =>
  res.json({
    message: "Profile Works"
  })
);

// @route     GET api/profile
// @desc      Get current user profile
// @access    private route
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(error => res.status(404).json(error));
  }
);

// @route     GET api/profile/handle/:handle
// @desc      Get profile by handle
// @access    Public route
router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = `There is no profile for the user with handle ${
          req.params.handle
        }`;
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(error => res.status(404).json(error));
});

// @route     GET api/profile/all
// @desc      Get all profile
// @access    Public route
router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors = "There are no profiles";
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(error => res.status(404).json({ profile: "No profile exist " }));
});

// @route     GET api/profile/user/:user_id
// @desc      Get profile by userid
// @access    Public route
router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = `There is no profile for the user with ID ${
          req.params.user_id
        }`;
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(error =>
      res.status(404).json({
        profile:
          "No Profile exists for this user please check the profile ID and try again"
      })
    );
});

// @route     POST api/profile
// @desc      Create/Update user profile
// @access    private route
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isvalid } = validateProfileInput(req.body);

    //Check Validation
    if (!isvalid) {
      //Return errors with 400 status
      return res.status(400).json(errors);
    }
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    //Skills - Split into an array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }

    // Socials
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    // Find a user
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //Update if profile exists
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        //Create Profile

        //Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = `The handle ${profileFields.handle} already exists`;
            res.status(400).json(errors);
          }
          // Save Profile

          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// @route     POST api/profile/experience
// @desc      Add Experience to profile
// @access    private route
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isvalid } = validateExperienceInput(req.body);

    //Check Validation
    if (!isvalid) {
      //Return errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      //Add to experience array
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route     POST api/profile/education
// @desc      Add Education to profile
// @access    private route
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isvalid } = validateEducationInput(req.body);

    //Check Validation
    if (!isvalid) {
      //Return errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      //Add to Education array
      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route     DELETE api/profile/experience/:exp_id
// @desc      Delete Experience from  profile
// @access    private route
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      //Get remove index
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

      //Splice out of array
      profile.experience.splice(removeIndex, 1);

      //Save
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(error => res.status(404).json(error));
    });
  }
);

// @route     DELETE api/profile/education/:edu_id
// @desc      Delete Education from  profile
// @access    private route
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      //Get remove index
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);

      //Splice out of array
      profile.education.splice(removeIndex, 1);

      //Save
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(error => res.status(404).json(error));
    });
  }
);

// @route     DELETE api/profile
// @desc      Delete User and  profile
// @access    private route
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ user: req.user.id }).then(() =>
        res.json({
          success: true
        })
      );
    });
  }
);

module.exports = router;
