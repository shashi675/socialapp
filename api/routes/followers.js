
const express = require("express");
const { getFollowingUsers, getUnFollowers, setFollower, deleteFollower, getFollowingUserDetails, getMyFollowersDetails } = require("../controller/followers.js");

const router = express.Router();

router.get("/", getFollowingUsers);
router.get("/unfollowers", getUnFollowers);
router.get("/getFollowingUserDetails", getFollowingUserDetails);
router.get("/getMyFollowersDetails", getMyFollowersDetails);
router.post("/", setFollower);
router.delete("/", deleteFollower);

module.exports = router;