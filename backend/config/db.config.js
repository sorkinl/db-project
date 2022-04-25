const mysql = require("mysql");
const config = {
  host: process.env.HOST,
  user: process.env.USER,
  password: "",
  database: process.env.DB,
};
const connection = mysql.createConnection(config);
module.exports = connection;
