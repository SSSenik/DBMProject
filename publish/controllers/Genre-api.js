const express = require('express');
var router = express.Router();

var Genre = require('../Models/Genre.js');

router.post('/Genre', function (req, res) {
    let obj = Object.assign(new Genre(), req.body);
    obj.save(msg => res.json(msg));
});

router.get('/Genre', function (req, res) {
    Genre.all(rows => res.send(rows));
});

router.get('/Genre/:id', function (req, res) {
    Genre.get(req.params.id, (row) => res.json(row));
});

router.put('/Genre/:id', function (req, res) {
    let obj = Object.assign(new Genre(), req.body);
    obj.id = req.params.id;
    obj.save((msg) => res.json(msg));
});

router.delete('/Genre/:id', function (req, res) {
    Genre.delete(req.params.id, (row) => res.json(row));
});

module.exports = router;