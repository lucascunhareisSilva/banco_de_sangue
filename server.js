const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001; // Altere a porta conforme necessário

// Middleware para parsear JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota para receber dados do formulário
app.post('/submit', (req, res) => {
    const data = req.body;

    // Caminho do arquivo JSON
    const filePath = path.join(__dirname, 'data.json');

    // Ler o arquivo existente, se existir
    fs.readFile(filePath, 'utf8', (err, fileData) => {
        let jsonData = [];
        if (!err && fileData) {
            jsonData = JSON.parse(fileData);
        }

        // Adicionar novos dados ao JSON existente
        jsonData.push(data);

        // Escrever os dados atualizados no arquivo JSON
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Erro ao escrever no arquivo JSON', err);
                res.status(500).json({ message: 'Erro ao salvar dados' });
            } else {
                res.json({ message: 'Dados salvos com sucesso' });
            }
        });
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
