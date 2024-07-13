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
            const sql = 'INSERT INTO doadores SET ?'; // Substitua 'doadores' pelo nome da sua tabela
            db.query(sql, data, (err, result) => {
                if (err) {
                    console.error('Erro ao inserir dados no MySQL:', err);
                } else {
                    console.log('Dados inseridos com sucesso no MySQL:', result);
                }
            });
        });
    } catch (error) {
        console.error('Erro ao parsear JSON:', error);
    }
});
