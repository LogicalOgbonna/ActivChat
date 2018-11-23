const express = require("express");

const router = express.Router();

// @route GET api/users/test
// @desc tests user route
// @access    public route
router.get("/test", (req, res) =>
  res.json({
    message: "Users Works"
  })
);

module.exports = router;
