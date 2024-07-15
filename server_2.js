const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

// Configuração da conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'banco_de_sangue'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Rota para buscar dados das tabelas
app.get('/dados', (req, res) => {
    const queryPessoal = 'SELECT * FROM pessoal';
    const queryContatoPessoal = 'SELECT * FROM contato_pessoal';
    const queryIdentidade = 'SELECT * FROM identidade';

    db.query(queryPessoal, (err, resultPessoal) => {
        if (err) {
            return res.status(500).send('Erro ao buscar dados da tabela pessoal');
        }

        db.query(queryContatoPessoal, (err, resultContatoPessoal) => {
            if (err) {
                return res.status(500).send('Erro ao buscar dados da tabela contato_pessoal');
            }

            db.query(queryIdentidade, (err, resultIdentidade) => {
                if (err) {
                    return res.status(500).send('Erro ao buscar dados da tabela identidade');
                }

                res.json({
                    pessoal: resultPessoal,
                    contato_pessoal: resultContatoPessoal,
                    identidade: resultIdentidade
                });
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
