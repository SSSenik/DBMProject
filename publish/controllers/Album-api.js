const express = require('express');
var router = express.Router();

var Album = require('../Models/Album.js');

router.post('/Album', function (req, res) {
    let obj = Object.assign(new Album(), req.body);
    obj.save(row => res.json(row));
});

router.get('/Album', function (req, res) {
    Album.all(rows => res.send(rows));
});

router.get('/Album/:id', function (req, res) {
    Album.get(req.params.id, (row) => res.json(row));
});

router.put('/Album/:id', function (req, res) {
    let obj = Object.assign(new Album(), req.body);
    obj.id = req.params.id;
    obj.save((row) => res.json(row));
});

router.delete('/Album/:id', function (req, res) {
    Album.delete(req.params.id, (row) => res.json(row));
});

module.exports = router;