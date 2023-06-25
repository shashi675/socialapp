
const express = require("express");
const {getUser, updateUser, searchUser} = require("../controller/users.js");

const router = express.Router();

router.get("/find", getUser);
router.get("/search", searchUser);
router.put("/", updateUser);

module.exports = router;