const express = require('express');
const fs = require('fs').promises;

const { generateServer } = require('./server/server');
const config = require('./server/config.json');

const app = express();
app.use(express.static('public'));

app.get('/schemas', (req, res) => {
    const schemas = config.schemas.map((schema) => require(schema.path));
    res.json(schemas);
});

app.post('/schemas', async (req, res) => {
    const newSchema = req.body.schema;
    const schemaPath = `./schemas/Schema-${newSchema.title}.json`;
    try {
        await fs.writeFile(schemaPath, JSON.stringify(newSchema));
        config.schemas.push({ name: newSchema.title, path: schemaPath });
        res.send('Schema criado com sucesso');
    } catch (e) {
        res.status(400).send('Não foi possivel criar o schema');
    }
});

app.post('/generate', (req, res) => {
    generateServer();
    res.send('GENERATED');
});

const server = app.listen(8081, () => {
    const host =
        server.address().address === '::'
            ? 'localhost'
            : server.address().address;
    const { port } = server.address();
    console.log('Example app listening at http://%s:%s', host, port);
});
