const express = require('express');
const router = express.Router();

const Genre = require(__basedir + '/Models/Genre.js');
const GenreSchema = require(__basedir + '/schemas/Schema-Genre.json');
router.post('/Genre', function (req, res) {
    let obj = Object.assign(new Genre(), req.body);
    obj.save((msg) => {
        if (!msg.success) return res.json(msg);
        Genre.getLastInserted((row) => {
            const jsonRes = JSON.parse(
                JSON.stringify(row, Object.keys(new Genre()).concat(['id']))
            )[0];
            for (const ref of GenreSchema.references) {
                const col = `${ref.model}_id`.toLowerCase();
                if (ref.relation === 'M-M' && req.body[col].length) {
                    Genre.manySave(ref.model, jsonRes.id, req.body[col]);
                }
            }

            res.json(msg);
        });
    });
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
    Genre.get(req.params.id, (row) =>
        res.json(
            JSON.parse(
                JSON.stringify(row, Object.keys(new Genre()).concat(['id']))
            )
        )
    );
});

router.put('/Genre/:id', function (req, res) {
    let obj = Object.assign(new Genre(), req.body);
    obj.id = req.params.id;
    obj.save((msg) => {
        if (!msg.success) return res.json(msg);
        for (const ref of GenreSchema.references) {
            const col = `${ref.model}_id`.toLowerCase();
            if (ref.relation === 'M-M' && req.body[col].length) {
                Genre.manySave(ref.model, req.params.id, req.body[col]);
            }
        }
        res.json(msg);
    });
});

router.delete('/Genre/:id', function (req, res) {
    Genre.delete(req.params.id, (row) => res.json(row));
});

router.get('/Genre/:model/:id', function (req, res) {
    Genre.many(req.params.model, req.params.id, (rows) =>
        res.json(
            JSON.parse(
                JSON.stringify(rows, Object.keys(new Genre()).concat(['id']))
            )
        )
    );
});


module.exports = router;