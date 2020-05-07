const express = require('express');
var router = express.Router();

var Aluno = require('../Models/Aluno.js');

router.post('/Aluno', function (req, res) {
    let obj = Object.assign(new Aluno(), req.body);
    obj.save(msg => res.json(msg));
});

router.get('/Aluno', function (req, res) {
    Aluno.all(rows => res.send(rows));
});

router.get('/Aluno/:id', function (req, res) {
    Aluno.get(req.params.id, (row) => res.json(row));
});

router.put('/Aluno/:id', function (req, res) {
    let obj = Object.assign(new Aluno(), req.body);
    obj.id = req.params.id;
    obj.save((msg) => res.json(msg));
});

router.delete('/Aluno/:id', function (req, res) {
    Aluno.delete(req.params.id, (row) => res.json(row));
});

module.exports = router;