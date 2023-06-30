
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


// middlewares
app.use(cookieParser());
app.use(express.json());    
app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "https://sksocialapp.netlify.app");
        res.appendHeader("Access-Control-Allow-Credentials", true);
        res.appendHeader("Access-Control-Allow-Headers", "content-type");
        next();
    })
    // app.use(cors({
    //         origin: 'https://sksocialapp.netlify.app',
    //         optionsSuccessStatus: 200,
    //         withCredentials: true
    //     }));

        // Enable CORS
        
        // app.use(cors());
    // const router = express.Router();
    // router.get("/", (req, res) => {
    //     res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
    //     res.setHeader("Access-Control-Allow-Credentials", "true");
    //     res.setHeader("Access-Control-Max-Age", "1800");
    //     res.setHeader("Access-Control-Allow-Headers", "content-type");
    //     res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
    // });

app.use('/uploads', express.static('uploads'));
        
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads');
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