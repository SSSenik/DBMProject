const express = require('express');
const router = express.Router();
const {
    presentationModeToHtmlString,
    columnConstraintToHtmlAttrs,
    schemaTypeToInputType,
} = require(__basedir + '/utils/utils.js');

const menuItems = [
    { href: '/backoffice/Album', name: 'Album' },
    { href: '/backoffice/Artist', name: 'Artist' },
    { href: '/backoffice/Genre', name: 'Genre' },
    { href: '/backoffice/Song', name: 'Song' },
];

const Album = require(__basedir + '/Models/Album.js');
const AlbumSchema = require(__basedir + '/schemas/Schema-Album.json');

const Artist = require(__basedir + '/Models/Artist.js');
const ArtistSchema = require(__basedir + '/schemas/Schema-Artist.json');

async function frontoffice(req, res) {
    const rowsAlbum = await new Promise((res) => {
        Album.top('name', 'DESC', 3, (rows) => {
            res(fetchRows(rows));
        });
    });
    const rowsArtist = await new Promise((res) => {
        Artist.top('name', 'DESC', 3, (rows) => {
            res(fetchRows(rows));
        });
    });
    res.render('home', {
        schemas: menuItems,
        tables: [
            {
                title: 'Album',
                rows: rowsAlbum,
                columns: Object.keys(new Album()).map(
                    (col) => AlbumSchema.properties[col].label
                ),
            },
            {
                title: 'Artist',
                rows: rowsArtist,
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