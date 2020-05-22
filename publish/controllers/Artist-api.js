const express = require('express');
var router = express.Router();

var Artist = require('../Models/Artist.js');

router.post('/Artist', function (req, res) {
    let obj = Object.assign(new Artist(), req.body);
    obj.save(msg => res.json(msg));
});

router.get('/Artist', function (req, res) {
    Artist.all(rows => res.send(rows));
});

router.get('/Artist/:id', function (req, res) {
    Artist.get(req.params.id, (row) => res.json(row));
});

router.put('/Artist/:id', function (req, res) {
    let obj = Object.assign(new Artist(), req.body);
    obj.id = req.params.id;
    obj.save((msg) => res.json(msg));
});

router.delete('/Artist/:id', function (req, res) {
    Artist.delete(req.params.id, (row) => res.json(row));
});

module.exports = router;