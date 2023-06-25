
const mySql = require("mysql");

const db = mySql.createConnection({
    host: "localhost",
    user: "root",
    password: "sk12345",
    database: "social"
});

module.exports = db;