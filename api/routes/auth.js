
const express = require("express");
const authJs = require("../controller/auth.js");

const register = authJs.register;
const login = authJs.login;
// const logout = authJs.logout;
const forgetPassword = authJs.forgetPassword;
const updatePassword = authJs.updatePassword;
const a = authJs.a;

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// router.get("/logout", logout);
router.get("/forgetPass", forgetPassword);
router.put("/", updatePassword);
router.get("/a", a);


module.exports = router;
