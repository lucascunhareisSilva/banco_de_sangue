const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Substitua pela sua senha do MySQL
    database: 'banco_de_sangue'
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        throw err;
    }
    console.log('Conectado ao MySQL!');
});

module.exports = connection;
