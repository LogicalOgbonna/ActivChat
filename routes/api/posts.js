const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

const router = express.Router();

// Load Post model
const Post = require("../../models/Posts");

//Load Profile model
const Profile = require("../../models/Profile");

//Load Post validation
const validatePostInput = require("../../validation/post");

// @route     GET api/posts/test
// @desc      tests post route
// @access    public route
router.get("/test", (req, res) =>
  res.json({
    message: "Posts Works"
  })
);

// @route     GET api/posts
// @desc      Get posts
// @access    Public route
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      if (posts.length < 1) {
        return res.status(404).json({ message: "No posts found" });
      }

      res.json(posts);
    })
    .catch(error => res.status(404).json(error));
});

// @route     GET api/posts/:id
// @desc      Get post by id
// @access    Public route
router.get("/:id", (req, res) => {
  const id = req.params.id;

  Post.findById({ _id: id })
    .then(post => {
      if (!post) {
        return res
          .status(404)
          .json({ message: `No post with the ID ${req.params.id} found` });
      }

      res.json(post);
    })
    .catch(error =>
      res.status(404).json({ message: `Invalid post ID ${req.params.id}` })
    );
});

// @route     POST api/posts
// @desc      Creates post
// @access    private route
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isvalid } = validatePostInput(req.body);

    //Check Validation
    if (!isvalid) {
      //Return errors with 400 status
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

// @route     DELETE api/posts/:id
// @desc      Delete post
// @access    private route
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }

          //Delete
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(error =>
          res.status(404).json({ postnotfound: "Post not found" })
        );
    });
  }
);

// @route     POST api/posts/like/:id
// @desc      Like post
// @access    private route
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already liked this post" });
          }

          //Add the user id to the like array
          post.likes.unshift({ user: req.user.id });

          //save to database
          post.save().then(post => res.json(post));
        })
        .catch(error =>
          res.status(404).json({ postnotfound: "Post not found" })
        );
    });
  }
);

// @route     POST api/posts/unlike/:id
// @desc      Unlike post
// @access    private route
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "You have not yet liked this post" });
          }

          // Get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice remove index out of the like array
          post.likes.splice(removeIndex, 1);

          //save to database
          post.save().then(post => res.json(post));
        })
        .catch(error =>
          res.status(404).json({ postnotfound: "Post not found" })
        );
    });
  }
);

// @route     POST api/posts/comment/:id
// @desc      Add comment to post
// @access    private route
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isvalid } = validatePostInput(req.body);

    //Check Validation
    if (!isvalid) {
      //Return errors with 400 status
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const comment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        //Add to comment array
        post.comments.unshift(comment);

        //Save to db
        post.save().then(post => res.json(post));
      })
      .catch(error => res.status(404).json({ postnotfound: "No post found" }));
  }
);

// @route     DELETE api/posts/comment/:post_id/comment_id
// @desc      Add comment to post
// @access    private route
router.delete(
  "/comment/:post_id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.post_id)
      .then(post => {
        if (
          post.comments.filter(
            item => item._id.toString() === req.params.comment_id
          ) === 0
        ) {
          return res
            .status(404)
            .json({ commnetnotfound: "Comment does no exist" });
        }

        //Get Remove Index
        const removeIndex = post.comments
          .map(item => item._id)
          .indexOf(req.params.comment_id);

        //Splice out of array
        post.comments.splice(removeIndex, 1);

        //Save to db
        post.save().then(post => res.json(post));
      })
      .catch(error => res.status(404).json({ postnotfound: "No post found" }));
  }
);

module.exports = router;
