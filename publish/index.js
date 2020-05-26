global.__basedir = __dirname;
const express = require('express');

const app = express();
app.use(express.json());
app.use(express.static('public'));



const AlbumApi = require('./controllers/Album-api');
app.use('/api', AlbumApi);
const ArtistApi = require('./controllers/Artist-api');
app.use('/api', ArtistApi);
const GenreApi = require('./controllers/Genre-api');
app.use('/api', GenreApi);
const SongApi = require('./controllers/Song-api');
app.use('/api', SongApi);

const server = app.listen(8082, () => {
    const host =
        server.address().address === '::'
            ? 'localhost'
            : server.address().address;
    const { port } = server.address();
    console.log('Example app listening at http://%s:%s', host, port);
});
