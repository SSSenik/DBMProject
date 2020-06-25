const express = require('express');
var router = express.Router();

var Song = require('../Models/Song.js');

router.post('/Song', function (req, res) {
    let obj = Object.assign(new Song(), req.body);
    obj.save(row => res.json(row));
});

router.get('/Song', function (req, res) {
    Song.all((rows) =>
        res.json(
            JSON.parse(
                JSON.stringify(rows, Object.keys(new Song()).concat(['id']))
            )
        )
    );
});

router.get('/Song/:id', function (req, res) {
    Song.get(req.params.id, (row) => res.json(row));
});

router.put('/Song/:id', function (req, res) {
    let obj = Object.assign(new Song(), req.body);
    obj.id = req.params.id;
    obj.save((row) => res.json(row));
});

router.delete('/Song/:id', function (req, res) {
    Song.delete(req.params.id, (row) => res.json(row));
});

router.get('/Song/:model/:id', function (req, res) {
 Song.many(req.params.model, req.params.id, rows => res.json(rows));
});


module.exports = router;