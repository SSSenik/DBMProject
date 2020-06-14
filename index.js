const express = require('express');

const { generateServer } = require('./server/server');

const app = express();
app.use(express.static('public'));

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
