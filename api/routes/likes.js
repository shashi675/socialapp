
const express = require("express");
const {getLikes} = require("../controller/likes.js");
const {addLike} = require("../controller/likes.js");
const {deleteLike} = require("../controller/likes.js");
const {a} = require("../controller/likes.js");


const router = express.Router();

router.get("/", getLikes);
router.get("/a", a);
router.post("/", addLike);
router.delete("/", deleteLike);

module.exports = router;
