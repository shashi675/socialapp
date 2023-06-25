
const jwt = require("jsonwebtoken");
const db = require("../connection.js");

const getLikes = (req, res) => {
    const q = "SELECT likesUId FROM likes where likesPId = ?";
    db.query(q, [req.query.postId], (err, data) => {
        if(err) return res.status(500).json(err);

        return res.status(200).json(data.map(like => like.likesUId));
    });
}

const addLike = (req, res) => {
    
    const token = req.body.token;
    if(!token) return res.status(401).json("user not logged in");
    
    jwt.verify(token, "secretKey", (err, userInfo) => {
        if(err) return res.status(403).json(err);
        
        const q = "INSERT INTO likes (`likesUId`, `likesPId`) VALUES (?)";
        const values = [userInfo.id, req.body.postId];

        db.query(q, [values], (err, data) => {
            if(err) return res.status(500).json(err);

            return res.status(200).json("liked the post");
        });
    });
} 

const deleteLike = (req, res) => {

    const token = req.query.token;
    if(!token) return res.status(401).json("user not logged in");

    jwt.verify(token, "secretKey", (err, userInfo) => {
        if(err) return res.status(403).json(err);

        const q =  "DELETE FROM likes WHERE `likesUId` = ? AND `likesPId` = ?";
        db.query(q, [userInfo.id, req.query.postId], (err, data) => {
            if(err) return res.status(500).json(err);

            return res.status(200).json("removed like from the post");
        });
    });
}

module.exports = { getLikes, addLike, deleteLike };