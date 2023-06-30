
const mySql = require("mysql");
require('dotenv').config();

// const urlDB = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`;

const db = mySql.createConnection({
    host: process.env.MYSQLHOST,
    // port: process.env.MYSQLPORT,
    database: process.env.MYSQLDATABASE,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
});

db.connect((err) => {
    
    if(err) {
        console.log("error occured", err);
        return;
    }
    console.log("connection successful");
})

module.exports = db;