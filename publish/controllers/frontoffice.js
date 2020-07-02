const express = require('express');
const router = express.Router();
const {
    presentationModeToHtmlString,
    columnConstraintToHtmlAttrs,
    schemaTypeToInputType,
} = require(__basedir + '/utils/utils.js');

const menuItems = [
    { name: 'Album' },
    { name: 'Artist' },
    { name: 'Genre' },
    { name: 'Song' },
];

const Album = require(__basedir + '/Models/Album.js');
const AlbumSchema = require(__basedir + '/schemas/Schema-Album.json');
const Artist = require(__basedir + '/Models/Artist.js');
const ArtistSchema = require(__basedir + '/schemas/Schema-Artist.json');
const Genre = require(__basedir + '/Models/Genre.js');
const GenreSchema = require(__basedir + '/schemas/Schema-Genre.json');
const Song = require(__basedir + '/Models/Song.js');
const SongSchema = require(__basedir + '/schemas/Schema-Song.json');
async function frontoffice(req, res) {
    res.render('home', {
        schemas: menuItems,
        tables: [
            {
                title: 'Album',
                limit: '3',
                orderText: 'DESC' === 'ASC' ? 'Ascendent' : 'Descendent',
                rows: await new Promise((res) => {
                    Album.top('name', 'DESC', 3, (rows) => {
                        res(fetchRows(rows));
                    });
                }),
                columns: Object.keys(new Album()).map(
                    (col) => AlbumSchema.properties[col].label
                ),
            },
            {
                title: 'Album',
                limit: '4',
                orderText: 'ASC' === 'ASC' ? 'Ascendent' : 'Descendent',
                rows: await new Promise((res) => {
                    Album.top('name', 'ASC', 4, (rows) => {
                        res(fetchRows(rows));
                    });
                }),
                columns: Object.keys(new Album()).map(
                    (col) => AlbumSchema.properties[col].label
                ),
            },
            {
                title: 'Artist',
                limit: '3',
                orderText: 'DESC' === 'ASC' ? 'Ascendent' : 'Descendent',
                rows: await new Promise((res) => {
                    Artist.top('name', 'DESC', 3, (rows) => {
                        res(fetchRows(rows));
                    });
                }),
                columns: Object.keys(new Artist()).map(
                    (col) => ArtistSchema.properties[col].label
                ),
            },
            {
                title: 'Artist',
                limit: '3',
                orderText: 'DESC' === 'ASC' ? 'Ascendent' : 'Descendent',
                rows: await new Promise((res) => {
                    Artist.top('name', 'DESC', 3, (rows) => {
                        res(fetchRows(rows));
                    });
                }),
                columns: Object.keys(new Artist()).map(
                    (col) => ArtistSchema.properties[col].label
                ),
            },
        ],
    });
}

function fetchRows(rows) {
    return rows.map((obj) => ({
        properties: Object.keys(obj).map((key) => ({
            name: key,
            value: obj[key],
        })),
    }));
}

router.get('/', frontoffice);
router.get('/Home', frontoffice);
module.exports = router;