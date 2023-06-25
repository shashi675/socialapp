
const db = require("../connection.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = (req, res) => {
    // check if user is already registered

    const q = "SELECT uId FROM users WHERE email = ?";
    db.query(q, [req.body.email], (err, data) => {

        if(err) return res.status(500).json(err);
        if(data.length) return res.status(409).json("user already registered");

        // create a new user
            // create hashed password
        
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const q = "INSERT INTO users (`userName`, `email`, `password`, `name`) values (?)";
        const values = [req.body.userName, req.body.email, hashedPassword, req.body.name];

        db.query(q, [values], (err, data) => {
            if(err) return res.status(500).json(err);
            return res.status(200).json("USER CREATED SUCCESSFULLY");
        })

    })
}

const login = (req, res) => {

    const q = "SELECT * FROM users WHERE userName = ?";

    db.query(q, req.body.userName, (err, data) => {
        if(err) return res.status(500).json(err);
        if(data.length === 0) return res.status(404).json("user not found");

        // match password
        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);

        if(!checkPassword) return res.status(400).json("wrong userId or password");

        const token = jwt.sign({id: data[0].uId}, "secretKey");
        const { password, ...others } = data[0];
        others["token"] = token;

        res
            .status(200)
            .json(others);

    });

}

// const logout = (req, res) => {

//     res.json({"currentUser": ""})
//     .status(200).json("user have been logged out successfully.");
    
// }

const forgetPassword = (req, res) => {
    const userName = req.query.userName;
    const email = req.query.email;

    const q = "SELECT password, email FROM users WHERE userName = ?";
    db.query(q, [userName], (err, data) => {
        if(err) return res.status(500).json(err);
        if(data.length === 0) return res.status(404).json("credentials not found");

        const email2 = data[0].email;
        if(email.localeCompare(email2) !== 0)
            return res.status(404).json("credentials not found");

        res.status(200).json({credentils: true});
    })
}

const updatePassword = (req, res) => {

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q = "UPDATE users SET `password`=? WHERE userName=?";

    db.query(q, [hashedPassword, req.body.userName], (err, data) => {
        if(err) return res.status(500).json(err);

        res.status(200).json("password updated");
    })

}

module.exports = { register, login, forgetPassword, updatePassword };