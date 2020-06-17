const express = require('express');
const del = require('del');
const fs = require('fs').promises;

const { generateServer } = require('./server/server');
const config = require('./server/config.json');

const app = express();
app.use(express.static('public'));
app.use(express.json());

app.get('/schemas', (req, res) => {
    const schemas = config.schemas.map((schema) => require(schema.path));
    res.json(schemas);
});

app.post('/schemas', async (req, res) => {
    try {
        const newSchema = req.body.schema;
        const schemaPath = `./schemas/Schema-${newSchema.title}.json`;
        await fs.writeFile(schemaPath, JSON.stringify(newSchema, null, '\t'));
        config.schemas.push({ name: newSchema.title, path: schemaPath });
        await fs.writeFile(
            './server/config.json',
            JSON.stringify(config, null, '\t')
        );
        res.send('Schema criado com sucesso');
    } catch (e) {
        console.log(e);
        res.status(400).send('Não foi possivel criar o schema');
    }
});

app.delete('/schemas', async (req, res) => {
    try {
        const schemaPath = `./schemas/Schema-${req.body.schemaName}.json`;
        await del(schemaPath);
        config.schemas = config.schemas.filter(
            (schema) => schema.name !== req.body.schemaName
        );
        await fs.writeFile(
            './server/config.json',
            JSON.stringify(config, null, '\t')
        );
        res.send('Schema apagado com sucesso');
    } catch (e) {
        console.log(e);
        res.status(400).send('Não foi possivel apagar o schema');
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
