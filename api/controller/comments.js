
const db = require("../connection.js");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const getComments = (req, res) => {
    const postId = req.query.postId;
    const q = "SELECT c.*, u.uId AS userId, u.name, u.profilePic FROM comments AS c JOIN users AS u ON c.commentUId = u.uId WHERE c.postId = ? ORDER BY c.createdAt DESC";
    db.query(q, [postId], (err, data) => {
        if(err) {
            return res.status(500).json(err);
        }
        res.status(200).json(data);
    })
}

const addComment = (req, res) => {
    const token = req.body.token;
    if(!token) return res.status(401).json("user not logged in");

    jwt.verify(token, "secretKey", (err, userInfo) => {
        if(err) return res.status(403).json("token not valid");

        const q = "INSERT INTO comments (`descn`, `createdAt`, `commentUId`, `postId`) VALUES (?)";
        const values = [
            req.body.descn,
            moment().format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,
            req.query.postId
        ]

        db.query(q, [values], (err, data) => {
            if(err) return res.status(500).json(err);
            return res.status(200).json("comment has been created successfully");
        })

    })
}


module.exports = { getComments, addComment };