const mysql = require('mysql');

connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database:process.env.DATABASE 
});


connection.connect(function (err) {

    if (err) {
        console.log(err);
        return;
    } else {
        console.log('Esta conectado a mysql ');
    }

});

