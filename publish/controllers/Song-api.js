const express = require('express');
const router = express.Router();

const Song = require(__basedir + '/Models/Song.js');
const SongSchema = require(__basedir + '/schemas/Schema-Song.json');
router.post('/Song', function (req, res) {
    let obj = Object.assign(new Song(), req.body);
    obj.save((msg) => {
        if (!msg.success) return res.json(msg);
        Song.getLastInserted((row) => {
            const jsonRes = JSON.parse(
                JSON.stringify(row, Object.keys(new Song()).concat(['id']))
            )[0];
            for (const ref of SongSchema.references) {
                const col = `${ref.model}_id`.toLowerCase();
                if (ref.relation === 'M-M' && req.body[col].length) {
                    Song.manySave(ref.model, jsonRes.id, req.body[col]);
                }
            }

            res.json(msg);
        });
    });
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
    Song.get(req.params.id, (row) =>
        res.json(
            JSON.parse(
                JSON.stringify(row, Object.keys(new Song()).concat(['id']))
            )
        )
    );
});

router.put('/Song/:id', function (req, res) {
    let obj = Object.assign(new Song(), req.body);
    obj.id = req.params.id;
    obj.save((msg) => {
        if (!msg.success) return res.json(msg);
        for (const ref of SongSchema.references) {
            const col = `${ref.model}_id`.toLowerCase();
            if (ref.relation === 'M-M' && req.body[col].length) {
                Song.manySave(ref.model, req.params.id, req.body[col]);
            }
        }
        res.json(msg);
    });
});

router.delete('/Song/:id', function (req, res) {
    Song.delete(req.params.id, (row) => res.json(row));
});

router.get('/Song/:model/:id', function (req, res) {
    Song.many(req.params.model, req.params.id, (rows) =>
        res.json(
            JSON.parse(
                JSON.stringify(rows, Object.keys(new Song()).concat(['id']))
            )
        )
    );
});


module.exports = router;