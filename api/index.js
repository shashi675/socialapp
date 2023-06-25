
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
require('dotenv').config();

const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/users.js");
const commentRoute = require("./routes/comments.js");
const likeRoute = require("./routes/likes.js");
const postRoute = require("./routes/posts.js");
const followerRoute = require("./routes/followers.js");



const app = express();
// const port = 3001;


// middlewares
app.use(cookieParser());
app.use(express.json());    
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
})
app.use(cors({
    origin: "https://6498570adf9c3f107aa942d5--stately-chimera-33fc15.netlify.app/"
}));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
})

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
    const file = req.file;
    res.status(200).json(file.filename);
})



app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/likes", likeRoute);
app.use("/api/comments", commentRoute);
app.use("/api/follower", followerRoute);

const port = process.env.port || 3001;
app.listen(port, () => {
    console.log(`server running on port ${port}`);
})