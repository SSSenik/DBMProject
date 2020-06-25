const express = require('express');
var router = express.Router();

var Genre = require('../Models/Genre.js');

router.post('/Genre', function (req, res) {
    let obj = Object.assign(new Genre(), req.body);
    obj.save(row => res.json(row));
});

router.get('/Genre', function (req, res) {
    Genre.all((rows) =>
        res.json(
            JSON.parse(
                JSON.stringify(rows, Object.keys(new Genre()).concat(['id']))
            )
        )
    );
});

router.get('/Genre/:id', function (req, res) {
    Genre.get(req.params.id, (row) => res.json(row));
});

router.put('/Genre/:id', function (req, res) {
    let obj = Object.assign(new Genre(), req.body);
    obj.id = req.params.id;
    obj.save((row) => res.json(row));
});

router.delete('/Genre/:id', function (req, res) {
    Genre.delete(req.params.id, (row) => res.json(row));
});

router.get('/Genre/:model/:id', function (req, res) {
 Genre.many(req.params.model, req.params.id, rows => res.json(rows));
});


module.exports = router;