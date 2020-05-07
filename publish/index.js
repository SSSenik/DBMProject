const express = require('express');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const AlunoApi = require('./controllers/Aluno-api.js');
app.use('/api', AlunoApi);

const server = app.listen(8082, () => {
    const host =
        server.address().address === '::'
            ? 'localhost'
            : server.address().address;
    const { port } = server.address();
    console.log('Example app listening at http://%s:%s', host, port);
});
