const mysql = require('mysql');

const db_config = require('./config.json');

const mydatabase = mysql.createConnection(db_config.database_config);

mydatabase.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
  });

module.exports = mydatabase;