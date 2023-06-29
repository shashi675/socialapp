
const jwt = require("jsonwebtoken");
const db = require("../connection.js");
require('dotenv').config();

const getFollowingUsers = (req, res) => {
    // those users to whom i am following:
    
    const token = req.query.token;
    if(!token) return res.status(401).json("user not logged in");

    jwt.verify(token, process.env.secretKey, (err, userInfo) => {
        if(err) return res.status(403).json("token not valid");

        const q = "SELECT followedUId FROM relations WHERE `followerUId` = ?";

        db.query(q, [userInfo.id], (err, data) => {
            if(err) return res.status(500).json(err);

            return res.status(200).json(data.map((follower) => follower.followedUId));
        });
    });
}

const getFollowingUserDetails = (req, res) => {
    // those users to whom i am following:
    
    const token = req.query.token;
    if(!token) return res.status(401).json("user not logged in");

    jwt.verify(token, process.env.secretKey, (err, userInfo) => {
        if(err) return res.status(403).json("token not valid");

        const q = "SELECT uId AS userId, name, profilePic FROM users WHERE uId IN (SELECT followedUId FROM relations WHERE `followerUId` = ?)";

        db.query(q, [userInfo.id], (err, data) => {
            if(err) return res.status(500).json(err);

            return res.status(200).json(data);
        });
    });
}

const getMyFollowersDetails = (req, res) => {
    // users who are following me:

    const token = req.query.token;
    if(!token) return res.status(401).json("user not logged in");

    jwt.verify(token, process.env.secretKey, (err, userInfo) => {
        if(err) return res.status(403).json("token not valid");

        const q = "SELECT uId AS userId, name, profilePic FROM users WHERE uId IN (SELECT followerUId FROM relations WHERE `followedUId` = ?)";

        db.query(q, [userInfo.id], (err, data) => {
            if(err) return res.status(500).json(err);

            return res.status(200).json(data);
        });
    });
}

const getUnFollowers = (req, res) => {
    const token = req.query.token;
    if(!token) return res.status(401).json("user not logged in");

    jwt.verify(token, process.env.secretKey, (err, userInfo) => {
        if(err) return res.status(403).json("token not valid");

        const q = "SELECT u.uId AS userId, u.name, u.profilePic FROM users AS u WHERE u.uId NOT IN (SELECT followedUId FROM relations WHERE followerUId = ?) AND u.uId != ? LIMIT 5";

        db.query(q, [userInfo.id, userInfo.id], (err, data) => {
            if(err) return res.status(500).json(err);

            return res.status(200).json(data);
        });
    });
}

const setFollower = (req, res) => {
    
    const token = req.query.token;
    if(!token) return res.status(401).json("user not logged in");

    jwt.verify(token, process.env.secretKey, (err, userInfo) => {
        if(err) return res.status(403).json("token not valid");

        const q = "INSERT INTO relations (`followerUId`, `followedUId`) VALUES (?)";

        const values = [userInfo.id, req.body.followedUId];
        db.query(q, [values], (err, data) => {
            if(err) return res.status(500).json(err);

            return res.status(200).json("user has been followed");
        });
    });
}

const deleteFollower = (req, res) => {
    
    const token = req.query.token;
    if(!token) return res.status(401).json("user not logged in");

    jwt.verify(token, process.env.secretKey, (err, userInfo) => {
        if(err) return res.status(403).json("token not valid");

        const q = "DELETE FROM relations WHERE followerUId = ? AND followedUId = ?";

        let followerUId, followedUId;
        if(req.query.followerUId) {
            followerUId = req.query.followerUId;
            followedUId = userInfo.id;
        }
        else {
            followedUId = req.query.followedUId;
            followerUId = userInfo.id;
        }

        db.query(q, [followerUId, followedUId], (err, data) => {
            if(err) return res.status(500).json(err);

            return res.status(200).json("user has been deleted");
        });
    });
}


module.exports = { getFollowingUsers, getUnFollowers, setFollower, deleteFollower, getFollowingUserDetails, getMyFollowersDetails };