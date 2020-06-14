const express = require('express');
var router = express.Router();
var Album = require('../Models/Album.js');
router.get('/Album', function (req, res) {
    Album.all((rows) => {
        res.render('list', {
            title: 'Album',
            columns: Object.keys(new Album()),
            rows: rows.map((r) => ({
                rowId: 'Album_' + r.id,
                properties: Object.keys(r).map((key) => r[key]),
                actions: [
                    {
                        link: './Album/Details/' + r.id,
                        image: { src: '../../images/read.png', alt: 'read' },
                        tooltip: 'Details',
                    },
                    {
                        link: './Album/Edit/' + r.id,
                        image: { src: '../../images/edit.png', alt: 'edit' },
                        tooltip: 'Edit',
                    },
                    {
                        link: '#',
                        image: {
                            src: '../../images/delete.png',
                            alt: 'delete',
                        },
                        tooltip: 'Delete',
                        events: [
                            {
                                name: 'onclick',
                                function: 'remove',
                                args: r.id,
                            },
                        ],
                    },
                ],
            })),
        });
    });
});

var Artist = require('../Models/Artist.js');
router.get('/Artist', function (req, res) {
    Artist.all((rows) => {
        res.render('list', {
            title: 'Artist',
            columns: Object.keys(new Artist()),
            rows: rows.map((r) => ({
                rowId: 'Artist_' + r.id,
                properties: Object.keys(r).map((key) => r[key]),
                actions: [
                    {
                        link: './Artist/Details/' + r.id,
                        image: { src: '../../images/read.png', alt: 'read' },
                        tooltip: 'Details',
                    },
                    {
                        link: './Artist/Edit/' + r.id,
                        image: { src: '../../images/edit.png', alt: 'edit' },
                        tooltip: 'Edit',
                    },
                    {
                        link: '#',
                        image: {
                            src: '../../images/delete.png',
                            alt: 'delete',
                        },
                        tooltip: 'Delete',
                        events: [
                            {
                                name: 'onclick',
                                function: 'remove',
                                args: r.id,
                            },
                        ],
                    },
                ],
            })),
        });
    });
});

var Genre = require('../Models/Genre.js');
router.get('/Genre', function (req, res) {
    Genre.all((rows) => {
        res.render('list', {
            title: 'Genre',
            columns: Object.keys(new Genre()),
            rows: rows.map((r) => ({
                rowId: 'Genre_' + r.id,
                properties: Object.keys(r).map((key) => r[key]),
                actions: [
                    {
                        link: './Genre/Details/' + r.id,
                        image: { src: '../../images/read.png', alt: 'read' },
                        tooltip: 'Details',
                    },
                    {
                        link: './Genre/Edit/' + r.id,
                        image: { src: '../../images/edit.png', alt: 'edit' },
                        tooltip: 'Edit',
                    },
                    {
                        link: '#',
                        image: {
                            src: '../../images/delete.png',
                            alt: 'delete',
                        },
                        tooltip: 'Delete',
                        events: [
                            {
                                name: 'onclick',
                                function: 'remove',
                                args: r.id,
                            },
                        ],
                    },
                ],
            })),
        });
    });
});

var Song = require('../Models/Song.js');
router.get('/Song', function (req, res) {
    Song.all((rows) => {
        res.render('list', {
            title: 'Song',
            columns: Object.keys(new Song()),
            rows: rows.map((r) => ({
                rowId: 'Song_' + r.id,
                properties: Object.keys(r).map((key) => r[key]),
                actions: [
                    {
                        link: './Song/Details/' + r.id,
                        image: { src: '../../images/read.png', alt: 'read' },
                        tooltip: 'Details',
                    },
                    {
                        link: './Song/Edit/' + r.id,
                        image: { src: '../../images/edit.png', alt: 'edit' },
                        tooltip: 'Edit',
                    },
                    {
                        link: '#',
                        image: {
                            src: '../../images/delete.png',
                            alt: 'delete',
                        },
                        tooltip: 'Delete',
                        events: [
                            {
                                name: 'onclick',
                                function: 'remove',
                                args: r.id,
                            },
                        ],
                    },
                ],
            })),
        });
    });
});

module.exports = router;