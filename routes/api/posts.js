const express = require("express");

const router = express.Router();

// @route     GET api/posts/test
// @desc      tests post route
// @access    public route
router.get("/test", (req, res) =>
  res.json({
    message: "Posts Works"
  })
);

module.exports = router;
