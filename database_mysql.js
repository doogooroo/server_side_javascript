var mysql      = require('mysql');
var con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'skagns486',
  database : 'o2'
});

con.connect();

var sql = "SELECT * FROM topic";

con.query(sql, function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].id);
  //console.log(fields.id);
});

con.end();