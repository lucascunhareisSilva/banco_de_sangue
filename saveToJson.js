const fs = require('fs');
const path = require('path');
const db = require('./db'); // Importa a configuração da conexão com o MySQL

// Caminho para o arquivo data.json
const filePath = path.join(__dirname, 'data.json');

// Função para ler o arquivo JSON
fs.readFile(filePath, 'utf8', (err, fileData) => {
    if (err) {
        console.error('Erro ao ler arquivo JSON:', err);
        return;
    }

    try {
        const jsonData = JSON.parse(fileData);

        // Itera sobre os dados e insere no MySQL
        jsonData.forEach((data) => {
            const { first_name, last_name, data_nascimento, tipo_sangue, phone, email, rg, cpf } = data;

            // Verifica se os dados já existem no banco de dados
            const checkSql = 'SELECT * FROM pessoal WHERE first_name = ? AND last_name = ? AND data_nascimento = ? AND tipo_sangue = ?';
            db.query(checkSql, [first_name, last_name, data_nascimento, tipo_sangue], (err, results) => {
                if (err) {
                    console.error('Erro ao verificar dados no banco de dados:', err);
                    return;
                }

                if (results.length === 0) {
                    // Insere na tabela pessoal
                    const sqlPessoal = 'INSERT INTO pessoal (first_name, last_name, data_nascimento, tipo_sangue) VALUES (?, ?, ?, ?)';
                    db.query(sqlPessoal, [first_name, last_name, data_nascimento, tipo_sangue], (err, result) => {
                        if (err) {
                            console.error('Erro ao inserir na tabela pessoal:', err);
                            return;
                        }
                        const doadorId = result.insertId;

                        // Insere na tabela contato_pessoal
                        const sqlContato = 'INSERT INTO contato_pessoal (doador_id, phone, email) VALUES (?, ?, ?)';
                        db.query(sqlContato, [doadorId, phone, email], (err) => {
                            if (err) {
                                console.error('Erro ao inserir na tabela contato_pessoal:', err);
                                return;
                            }

                            // Insere na tabela identidade
                            const sqlIdentidade = 'INSERT INTO identidade (doador_id, rg, cpf) VALUES (?, ?, ?)';
                            db.query(sqlIdentidade, [doadorId, rg, cpf], (err) => {
                                if (err) {
                                    console.error('Erro ao inserir na tabela identidade:', err);
                                } else {
                                    console.log('Dados inseridos com sucesso no MySQL');
                                }
                            });
                        });
                    });
                } else {
                    console.log('Dados já existem no banco de dados. Ignorando inserção.');
                }
            });
        });
    } catch (error) {
        console.error('Erro ao parsear JSON:', error);
    }
});
