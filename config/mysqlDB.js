var mysql = require('mysql');
const config = require('config');

var con = mysql.createConnection({
  host: config.get('host'),
  user: config.get('user'),
  password: config.get('password'),
  database: config.get('database')
});

const connectDB = async () => {
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    // console.log("con!", con);
  });
};

module.exports = { connectDB, con };
