const express = require('express');
const mustache = require('mustache');
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

app.put('/schemas', async (req, res) => {
    try {
        const schema = req.body.schema;
        const schemaPath = `./schemas/Schema-${schema.title}.json`;
        await fs.writeFile(schemaPath, JSON.stringify(schema, null, '\t'));
        res.send('Schema editado com sucesso');
    } catch (e) {
        res.status(400).send('Não foi possivel editar o schema');
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

app.post('/styles', async (req, res) => {
    try {
        const newStyles = req.body.styles;
        const data = await fs.readFile(`./staticFiles/styles.mustache`);

        const stylesData = {
            ...newStyles,
            backgroundPattern: newStyles.pattern
                ? newStyles.pattern.replace(
                      '<foregroundColor>',
                      newStyles.foregroundColor
                  )
                : '',
        };

        const output = mustache.render(data.toString(), stylesData);

        await fs.writeFile(`./staticFiles/styles.css`, output);
        res.send('Styles criado com sucesso');
    } catch (e) {
        console.log(e);
        res.status(400).send('Não foi possivel criar o Styles');
    }
});

app.get('/views', (req, res) => {
    res.json(config.frontoffice);
});

app.post('/views', async (req, res) => {
    try {
        config.frontoffice = req.body.views;
        await fs.writeFile(
            './server/config.json',
            JSON.stringify(config, null, '\t')
        );
        res.send('Views criadas com sucesso');
    } catch (e) {
        console.log(e);
        res.status(400).send('Não foi possivel criar o schema');
    }
});

app.post('/generate', async (req, res) => {
    await generateServer();
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
