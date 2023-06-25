
const express = require("express");
const { getComments, addComment } = require("../controller/comments.js");

const router = express.Router();

router.get("/", getComments);
router.post("/", addComment);

module.exports = router;