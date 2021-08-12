const mysql = require('mysql');
var pool = mysql.createPool({
  "user" : "root", 
  "password" : "", 
  "database": "watchlist", 
  "host" : "127.0.0.1", 
  "port" : 3306, 
});

module.exports.pool = pool;

