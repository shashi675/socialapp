
const express = require("express");
const { getPosts, addPost, deletePost } = require("../controller/posts.js");

const router = express.Router();

router.get("/", getPosts);
router.post("/", addPost);
router.delete("/", deletePost);

module.exports = router;