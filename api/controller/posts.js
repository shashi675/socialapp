
const jwt = require("jsonwebtoken");
const db = require("../connection.js");
const moment = require("moment");


const getPosts = (req, res) => {
    const token = req.query.token;
    if(!token) return res.status(401).json("user not logged in");

    jwt.verify(token, "secretKey", (err, userInfo) => {
        if(err) return res.status(403).json("token not valid");

        // const q = 'SELECT p.*, u.uId AS userId, u.name, u.profilePic FROM posts AS p JOIN users AS u ON (p.postUId = u.uId) LEFT JOIN relations AS r ON (p.postUId = r.followedUId) WHERE r.followerUId = ? OR p.postUId = ? ORDER BY p.createdAt DESC';

        const q = "SELECT p.*, u.uId AS userId, u.name, u.profilePic FROM posts AS p JOIN users AS u ON (p.postUId = u.uId) WHERE u.uId IN (SELECT followedUId FROM relations WHERE followerUId = ?) OR p.postUId = ? ORDER BY p.createdAt DESC"

        db.query(q, [userInfo.id, userInfo.id], (err, data) => {
            if(err) return res.status(500).json(err);

            return res.status(200).json(data);
        })

    })
}

const addPost = (req, res) => {
    const token = req.body.token;
    if(!token) return res.status(401).json("user not logged in");

    jwt.verify(token, "secretKey", (err, userInfo) => {
        if(err) return res.status(403).json("token not valid");

        const q = "INSERT INTO posts (`descn`, `img`, `postUId`, `createdAt`) VALUES (?)";
        const values = [
            req.body.descn,
            req.body.img,
            userInfo.id,
            moment().format("YYYY-MM-DD HH:mm:ss")
        ]
        db.query(q, [values], (err, data) => {
            if(err) return res.status(500).json(err);
    
            return res.status(200).json("post has been created successfully");
        })

    })
}

const deletePost = (req, res) => {
    const token = req.query.token;
    if(!token) return res.status(401).json("user not logged in");

    jwt.verify(token, "secretKey", (err, userInfo) => {
        if(err) return res.status(403).json("token not valid");
        const q = "DELETE FROM posts WHERE pId = ?";
        db.query(q, [req.query.postId], (err, data) => {
            if(err) return res.status(500).json(err);
    
            return res.status(200).json("post deleted successfully");
        })

    })
}

module.exports = {getPosts, addPost, deletePost};