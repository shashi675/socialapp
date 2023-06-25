
const jwt = require("jsonwebtoken");
const db = require("../connection.js");

const getUser = (req, res) => {
    const token = req.query.token;
    if(!token) return res.status(401).json("user not logged in");

    jwt.verify(token, "secretKey", (err, userInfo) => {
        if(err) return res.status(403).json("token not valid");

        const q = "SELECT * FROM users WHERE `uId` = ?";

        db.query(q, [req.query.uId], (err, data) => {
            if(err) return res.status(500).json(err);
            const {password, ...others} = data[0];

            return res.status(200).json(others);
        })
    })
}

const updateUser = (req, res) => {
    const token = req.query.token;
    if(!token) return res.status(401).json("user not logged in");

    jwt.verify(token, "secretKey", (err, userInfo) => {
        if(err) return res.status(403).json("token not valid");

        const q = "UPDATE users SET `name`=?, `city`=?, `language`=?, `profilePic`=?, `coverPic`=? WHERE uId=?";

        db.query(q, [
            req.body.name,
            req.body.city,
            req.body.language,
            req.body.profilePic,
            req.body.coverPic,
            userInfo.id
        ], (err, data) => {
            if(err) return res.status(500).json(err);
            if(data.affectedRows > 0) return res.status(200).json("profile updated");
            else return res.status(403).json("this is not your profile");
        })
    })
}

const searchUser = (req, res) => {
    const q = "SELECT uId AS userId, userName, name, profilePic FROM users WHERE userName LIKE ? OR name LIKE ?";

    db.query(q, [req.query.searchText + "%", req.query.searchText + "%"], (err, data) => {
        if(err) return res.status(500).json(err);

        return res.status(200).json(data);
    })
}

module.exports ={ getUser, updateUser, searchUser };