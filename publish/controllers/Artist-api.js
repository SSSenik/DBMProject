const express = require('express');
const router = express.Router();

const Artist = require(__basedir + '/Models/Artist.js');
const ArtistSchema = require(__basedir + '/schemas/Schema-Artist.json');
router.post('/Artist', function (req, res) {
    let obj = Object.assign(new Artist(), req.body);
    obj.save((msg) => {
        if (!msg.success) return res.json(msg);
        Artist.getLastInserted((row) => {
            const jsonRes = JSON.parse(
                JSON.stringify(row, Object.keys(new Artist()).concat(['id']))
            )[0];
            for (const ref of ArtistSchema.references) {
                const col = `${ref.model}_id`.toLowerCase();
                if (ref.relation === 'M-M' && req.body[col].length) {
                    Artist.manySave(ref.model, jsonRes.id, req.body[col]);
                }
            }

            res.json(msg);
        });
    });
});

router.get('/Artist', function (req, res) {
    Artist.all((rows) =>
        res.json(
            JSON.parse(
                JSON.stringify(rows, Object.keys(new Artist()).concat(['id']))
            )
        )
    );
});

router.get('/Artist/:id', function (req, res) {
    Artist.get(req.params.id, (row) =>
        res.json(
            JSON.parse(
                JSON.stringify(row, Object.keys(new Artist()).concat(['id']))
            )
        )
    );
});

router.put('/Artist/:id', function (req, res) {
    let obj = Object.assign(new Artist(), req.body);
    obj.id = req.params.id;
    obj.save((msg) => {
        if (!msg.success) return res.json(msg);
        for (const ref of ArtistSchema.references) {
            const col = `${ref.model}_id`.toLowerCase();
            if (ref.relation === 'M-M' && req.body[col].length) {
                Artist.manySave(ref.model, req.params.id, req.body[col]);
            }
        }
        res.json(msg);
    });
});

router.delete('/Artist/:id', function (req, res) {
    Artist.delete(req.params.id, (row) => res.json(row));
});

router.get('/Artist/:model/:id', function (req, res) {
    Artist.many(req.params.model, req.params.id, (rows) =>
        res.json(
            JSON.parse(
                JSON.stringify(rows, Object.keys(new Artist()).concat(['id']))
            )
        )
    );
});


module.exports = router;