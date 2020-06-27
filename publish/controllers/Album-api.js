const express = require('express');
const router = express.Router();

const Album = require(__basedir + '/Models/Album.js');
const AlbumSchema = require(__basedir + '/schemas/Schema-Album.json');
router.post('/Album', function (req, res) {
    let obj = Object.assign(new Album(), req.body);
    obj.save((msg) => {
        if (!msg.success) return res.json(msg);
        Album.getLastInserted((row) => {
            const jsonRes = JSON.parse(
                JSON.stringify(row, Object.keys(new Album()).concat(['id']))
            )[0];
            for (const ref of AlbumSchema.references) {
                const col = `${ref.model}_id`.toLowerCase();
                if (ref.relation === 'M-M' && req.body[col].length) {
                    Album.manySave(ref.model, jsonRes.id, req.body[col]);
                }
            }

            res.json(msg);
        });
    });
});

router.get('/Album', function (req, res) {
    Album.all((rows) =>
        res.json(
            JSON.parse(
                JSON.stringify(rows, Object.keys(new Album()).concat(['id']))
            )
        )
    );
});

router.get('/Album/:id', function (req, res) {
    Album.get(req.params.id, (row) =>
        res.json(
            JSON.parse(
                JSON.stringify(row, Object.keys(new Album()).concat(['id']))
            )
        )
    );
});

router.put('/Album/:id', function (req, res) {
    let obj = Object.assign(new Album(), req.body);
    obj.id = req.params.id;
    obj.save((msg) => {
        if (!msg.success) return res.json(msg);
        for (const ref of AlbumSchema.references) {
            const col = `${ref.model}_id`.toLowerCase();
            if (ref.relation === 'M-M' && req.body[col].length) {
                Album.manySave(ref.model, req.params.id, req.body[col]);
            }
        }
        res.json(msg);
    });
});

router.delete('/Album/:id', function (req, res) {
    Album.delete(req.params.id, (row) => res.json(row));
});

router.get('/Album/:model/:id', function (req, res) {
    Album.many(req.params.model, req.params.id, (rows) =>
        res.json(
            JSON.parse(
                JSON.stringify(rows, Object.keys(new Album()).concat(['id']))
            )
        )
    );
});


module.exports = router;