const express = require('express');
const router = express.Router();
const { presentationModeToHtmlType, columnConstraintToHtmlAttrs } = require(__basedir + '/utils/utils.js');

const Album = require(__basedir + '/Models/Album.js');
const AlbumSchema = require(__basedir + '/schemas/Schema-Album.json');
router.get('/Album', function (req, res) {
    Album.all((rows) => {
        res.render('list', {
            title: 'Album',
            columns: Object.keys(new Album()),
            rows: rows.map((r) => ({
                rowId: 'Album_' + r.id,
                properties: Object.keys(r).map((key) => r[key]),
                actions: [
                    {
                        link: './Album/Details/' + r.id,
                        image: { src: '../../images/read.png', alt: 'read' },
                        tooltip: 'Details',
                    },
                    {
                        link: './Album/Edit/' + r.id,
                        image: { src: '../../images/edit.png', alt: 'edit' },
                        tooltip: 'Edit',
                    },
                    {
                        link: '#',
                        image: {
                            src: '../../images/delete.png',
                            alt: 'delete',
                        },
                        tooltip: 'Delete',
                        events: [
                            {
                                name: 'onclick',
                                function: 'remove',
                                args: r.id,
                            },
                        ],
                    },
                ],
            })),
        });
    });
});

router.get('/Album/Details/:id', function (req, res) {
    Album.get(req.params.id, function (row) {
        res.render('details', {
            title: 'Album',
            properties: Object.getOwnPropertyNames(row)
                .filter((prop) => AlbumSchema.properties.hasOwnProperty(prop))
                .map((prop) => ({
                    name: prop,
                    value: row[prop],
                })),
            references: Object.getOwnPropertyNames(row)
                .filter((prop) =>
                    AlbumSchema.references.find(
                        (ref) => `${ref.model}_id`.toLowerCase() === prop
                    )
                )
                .map((prop) =>
                    AlbumSchema.references.find(
                        (ref) => `${ref.model}_id`.toLowerCase() === prop
                    )
                )
                .map((ref) => ({
                    label: ref.label,
                    model: ref.model,
                    values:
                        ref.relation === 'M-M'
                            ? 'Album/' + req.params.id
                            : row[(ref.model + '_id').toLowerCase()],
                    isManyToMany: ref.relation === 'M-M',
                })),
            get hasReferences() {
                return this.references.length > 0;
            },
        });
    });
});

router.get('/Album/Insert', function (req, res) {
    res.render('insert', {
        title: 'Album',
        properties: Object.getOwnPropertyNames(new Album())
            .filter((prop) => AlbumSchema.properties.hasOwnProperty(prop))
            .map((prop) => ({
                type: presentationModeToHtmlType(
                    AlbumSchema.properties[prop].presentationMode,
                    AlbumSchema.properties[prop].type
                ),
                required: AlbumSchema.required.includes(prop),
                attrs: columnConstraintToHtmlAttrs(AlbumSchema.properties[prop]),
                name: prop,
            })),
        references: AlbumSchema.references.map((ref) => ({
            name: `${ref.model}_id`.toLowerCase(),
            label: ref.label,
            model: ref.model,
            isManyToMany: ref.relation === 'M-M',
        })),
        get hasReferences() {
            return this.references.length > 0;
        },
    });
});

router.get('/Album/Edit/:id', function (req, res) {
    Album.get(req.params.id, function (row) {
        res.render('edit', {
            title: 'Album',
            id: req.params.id,
            properties: Object.getOwnPropertyNames(row)
                .filter((prop) => AlbumSchema.properties.hasOwnProperty(prop))
                .map((prop) => ({
                    type: presentationModeToHtmlType(
                        AlbumSchema.properties[prop].presentationMode,
                        AlbumSchema.properties[prop].type
                    ),
                    required: AlbumSchema.required.includes(prop),
                    attrs: columnConstraintToHtmlAttrs(
                        AlbumSchema.properties[prop]
                    ),
                    name: prop,
                    value: row[prop],
                })),
            references: Object.getOwnPropertyNames(row)
                .filter((prop) =>
                    AlbumSchema.references.find(
                        (ref) => `${ref.model}_id`.toLowerCase() === prop
                    )
                )
                .map((prop) =>
                    AlbumSchema.references.find(
                        (ref) => `${ref.model}_id`.toLowerCase() === prop
                    )
                )
                .map((ref) => ({
                    name: `${ref.model}_id`.toLowerCase(),
                    label: ref.label,
                    model: ref.model,
                    values:
                        ref.relation === 'M-M'
                            ? 'Album/' + req.params.id
                            : row[(ref.model + '_id').toLowerCase()],
                    isManyToMany: ref.relation === 'M-M',
                })),
            get hasReferences() {
                return this.references.length > 0;
            },
        });
    });
});

const Artist = require(__basedir + '/Models/Artist.js');
const ArtistSchema = require(__basedir + '/schemas/Schema-Artist.json');
router.get('/Artist', function (req, res) {
    Artist.all((rows) => {
        res.render('list', {
            title: 'Artist',
            columns: Object.keys(new Artist()),
            rows: rows.map((r) => ({
                rowId: 'Artist_' + r.id,
                properties: Object.keys(r).map((key) => r[key]),
                actions: [
                    {
                        link: './Artist/Details/' + r.id,
                        image: { src: '../../images/read.png', alt: 'read' },
                        tooltip: 'Details',
                    },
                    {
                        link: './Artist/Edit/' + r.id,
                        image: { src: '../../images/edit.png', alt: 'edit' },
                        tooltip: 'Edit',
                    },
                    {
                        link: '#',
                        image: {
                            src: '../../images/delete.png',
                            alt: 'delete',
                        },
                        tooltip: 'Delete',
                        events: [
                            {
                                name: 'onclick',
                                function: 'remove',
                                args: r.id,
                            },
                        ],
                    },
                ],
            })),
        });
    });
});

router.get('/Artist/Details/:id', function (req, res) {
    Artist.get(req.params.id, function (row) {
        res.render('details', {
            title: 'Artist',
            properties: Object.getOwnPropertyNames(row)
                .filter((prop) => ArtistSchema.properties.hasOwnProperty(prop))
                .map((prop) => ({
                    name: prop,
                    value: row[prop],
                })),
            references: Object.getOwnPropertyNames(row)
                .filter((prop) =>
                    ArtistSchema.references.find(
                        (ref) => `${ref.model}_id`.toLowerCase() === prop
                    )
                )
                .map((prop) =>
                    ArtistSchema.references.find(
                        (ref) => `${ref.model}_id`.toLowerCase() === prop
                    )
                )
                .map((ref) => ({
                    label: ref.label,
                    model: ref.model,
                    values:
                        ref.relation === 'M-M'
                            ? 'Artist/' + req.params.id
                            : row[(ref.model + '_id').toLowerCase()],
                    isManyToMany: ref.relation === 'M-M',
                })),
            get hasReferences() {
                return this.references.length > 0;
            },
        });
    });
});

router.get('/Artist/Insert', function (req, res) {
    res.render('insert', {
        title: 'Artist',
        properties: Object.getOwnPropertyNames(new Artist())
            .filter((prop) => ArtistSchema.properties.hasOwnProperty(prop))
            .map((prop) => ({
                type: presentationModeToHtmlType(
                    ArtistSchema.properties[prop].presentationMode,
                    ArtistSchema.properties[prop].type
                ),
                required: ArtistSchema.required.includes(prop),
                attrs: columnConstraintToHtmlAttrs(ArtistSchema.properties[prop]),
                name: prop,
            })),
        references: ArtistSchema.references.map((ref) => ({
            name: `${ref.model}_id`.toLowerCase(),
            label: ref.label,
            model: ref.model,
            isManyToMany: ref.relation === 'M-M',
        })),
        get hasReferences() {
            return this.references.length > 0;
        },
    });
});

router.get('/Artist/Edit/:id', function (req, res) {
    Artist.get(req.params.id, function (row) {
        res.render('edit', {
            title: 'Artist',
            id: req.params.id,
            properties: Object.getOwnPropertyNames(row)
                .filter((prop) => ArtistSchema.properties.hasOwnProperty(prop))
                .map((prop) => ({
                    type: presentationModeToHtmlType(
                        ArtistSchema.properties[prop].presentationMode,
                        ArtistSchema.properties[prop].type
                    ),
                    required: ArtistSchema.required.includes(prop),
                    attrs: columnConstraintToHtmlAttrs(
                        ArtistSchema.properties[prop]
                    ),
                    name: prop,
                    value: row[prop],
                })),
            references: Object.getOwnPropertyNames(row)
                .filter((prop) =>
                    ArtistSchema.references.find(
                        (ref) => `${ref.model}_id`.toLowerCase() === prop
                    )
                )
                .map((prop) =>
                    ArtistSchema.references.find(
                        (ref) => `${ref.model}_id`.toLowerCase() === prop
                    )
                )
                .map((ref) => ({
                    name: `${ref.model}_id`.toLowerCase(),
                    label: ref.label,
                    model: ref.model,
                    values:
                        ref.relation === 'M-M'
                            ? 'Artist/' + req.params.id
                            : row[(ref.model + '_id').toLowerCase()],
                    isManyToMany: ref.relation === 'M-M',
                })),
            get hasReferences() {
                return this.references.length > 0;
            },
        });
    });
});

const Genre = require(__basedir + '/Models/Genre.js');
const GenreSchema = require(__basedir + '/schemas/Schema-Genre.json');
router.get('/Genre', function (req, res) {
    Genre.all((rows) => {
        res.render('list', {
            title: 'Genre',
            columns: Object.keys(new Genre()),
            rows: rows.map((r) => ({
                rowId: 'Genre_' + r.id,
                properties: Object.keys(r).map((key) => r[key]),
                actions: [
                    {
                        link: './Genre/Details/' + r.id,
                        image: { src: '../../images/read.png', alt: 'read' },
                        tooltip: 'Details',
                    },
                    {
                        link: './Genre/Edit/' + r.id,
                        image: { src: '../../images/edit.png', alt: 'edit' },
                        tooltip: 'Edit',
                    },
                    {
                        link: '#',
                        image: {
                            src: '../../images/delete.png',
                            alt: 'delete',
                        },
                        tooltip: 'Delete',
                        events: [
                            {
                                name: 'onclick',
                                function: 'remove',
                                args: r.id,
                            },
                        ],
                    },
                ],
            })),
        });
    });
});

router.get('/Genre/Details/:id', function (req, res) {
    Genre.get(req.params.id, function (row) {
        res.render('details', {
            title: 'Genre',
            properties: Object.getOwnPropertyNames(row)
                .filter((prop) => GenreSchema.properties.hasOwnProperty(prop))
                .map((prop) => ({
                    name: prop,
                    value: row[prop],
                })),
            references: Object.getOwnPropertyNames(row)
                .filter((prop) =>
                    GenreSchema.references.find(
                        (ref) => `${ref.model}_id`.toLowerCase() === prop
                    )
                )
                .map((prop) =>
                    GenreSchema.references.find(
                        (ref) => `${ref.model}_id`.toLowerCase() === prop
                    )
                )
                .map((ref) => ({
                    label: ref.label,
                    model: ref.model,
                    values:
                        ref.relation === 'M-M'
                            ? 'Genre/' + req.params.id
                            : row[(ref.model + '_id').toLowerCase()],
                    isManyToMany: ref.relation === 'M-M',
                })),
            get hasReferences() {
                return this.references.length > 0;
            },
        });
    });
});

router.get('/Genre/Insert', function (req, res) {
    res.render('insert', {
        title: 'Genre',
        properties: Object.getOwnPropertyNames(new Genre())
            .filter((prop) => GenreSchema.properties.hasOwnProperty(prop))
            .map((prop) => ({
                type: presentationModeToHtmlType(
                    GenreSchema.properties[prop].presentationMode,
                    GenreSchema.properties[prop].type
                ),
                required: GenreSchema.required.includes(prop),
                attrs: columnConstraintToHtmlAttrs(GenreSchema.properties[prop]),
                name: prop,
            })),
        references: GenreSchema.references.map((ref) => ({
            name: `${ref.model}_id`.toLowerCase(),
            label: ref.label,
            model: ref.model,
            isManyToMany: ref.relation === 'M-M',
        })),
        get hasReferences() {
            return this.references.length > 0;
        },
    });
});

router.get('/Genre/Edit/:id', function (req, res) {
    Genre.get(req.params.id, function (row) {
        res.render('edit', {
            title: 'Genre',
            id: req.params.id,
            properties: Object.getOwnPropertyNames(row)
                .filter((prop) => GenreSchema.properties.hasOwnProperty(prop))
                .map((prop) => ({
                    type: presentationModeToHtmlType(
                        GenreSchema.properties[prop].presentationMode,
                        GenreSchema.properties[prop].type
                    ),
                    required: GenreSchema.required.includes(prop),
                    attrs: columnConstraintToHtmlAttrs(
                        GenreSchema.properties[prop]
                    ),
                    name: prop,
                    value: row[prop],
                })),
            references: Object.getOwnPropertyNames(row)
                .filter((prop) =>
                    GenreSchema.references.find(
                        (ref) => `${ref.model}_id`.toLowerCase() === prop
                    )
                )
                .map((prop) =>
                    GenreSchema.references.find(
                        (ref) => `${ref.model}_id`.toLowerCase() === prop
                    )
                )
                .map((ref) => ({
                    name: `${ref.model}_id`.toLowerCase(),
                    label: ref.label,
                    model: ref.model,
                    values:
                        ref.relation === 'M-M'
                            ? 'Genre/' + req.params.id
                            : row[(ref.model + '_id').toLowerCase()],
                    isManyToMany: ref.relation === 'M-M',
                })),
            get hasReferences() {
                return this.references.length > 0;
            },
        });
    });
});

const Song = require(__basedir + '/Models/Song.js');
const SongSchema = require(__basedir + '/schemas/Schema-Song.json');
router.get('/Song', function (req, res) {
    Song.all((rows) => {
        res.render('list', {
            title: 'Song',
            columns: Object.keys(new Song()),
            rows: rows.map((r) => ({
                rowId: 'Song_' + r.id,
                properties: Object.keys(r).map((key) => r[key]),
                actions: [
                    {
                        link: './Song/Details/' + r.id,
                        image: { src: '../../images/read.png', alt: 'read' },
                        tooltip: 'Details',
                    },
                    {
                        link: './Song/Edit/' + r.id,
                        image: { src: '../../images/edit.png', alt: 'edit' },
                        tooltip: 'Edit',
                    },
                    {
                        link: '#',
                        image: {
                            src: '../../images/delete.png',
                            alt: 'delete',
                        },
                        tooltip: 'Delete',
                        events: [
                            {
                                name: 'onclick',
                                function: 'remove',
                                args: r.id,
                            },
                        ],
                    },
                ],
            })),
        });
    });
});

router.get('/Song/Details/:id', function (req, res) {
    Song.get(req.params.id, function (row) {
        res.render('details', {
            title: 'Song',
            properties: Object.getOwnPropertyNames(row)
                .filter((prop) => SongSchema.properties.hasOwnProperty(prop))
                .map((prop) => ({
                    name: prop,
                    value: row[prop],
                })),
            references: Object.getOwnPropertyNames(row)
                .filter((prop) =>
                    SongSchema.references.find(
                        (ref) => `${ref.model}_id`.toLowerCase() === prop
                    )
                )
                .map((prop) =>
                    SongSchema.references.find(
                        (ref) => `${ref.model}_id`.toLowerCase() === prop
                    )
                )
                .map((ref) => ({
                    label: ref.label,
                    model: ref.model,
                    values:
                        ref.relation === 'M-M'
                            ? 'Song/' + req.params.id
                            : row[(ref.model + '_id').toLowerCase()],
                    isManyToMany: ref.relation === 'M-M',
                })),
            get hasReferences() {
                return this.references.length > 0;
            },
        });
    });
});

router.get('/Song/Insert', function (req, res) {
    res.render('insert', {
        title: 'Song',
        properties: Object.getOwnPropertyNames(new Song())
            .filter((prop) => SongSchema.properties.hasOwnProperty(prop))
            .map((prop) => ({
                type: presentationModeToHtmlType(
                    SongSchema.properties[prop].presentationMode,
                    SongSchema.properties[prop].type
                ),
                required: SongSchema.required.includes(prop),
                attrs: columnConstraintToHtmlAttrs(SongSchema.properties[prop]),
                name: prop,
            })),
        references: SongSchema.references.map((ref) => ({
            name: `${ref.model}_id`.toLowerCase(),
            label: ref.label,
            model: ref.model,
            isManyToMany: ref.relation === 'M-M',
        })),
        get hasReferences() {
            return this.references.length > 0;
        },
    });
});

router.get('/Song/Edit/:id', function (req, res) {
    Song.get(req.params.id, function (row) {
        res.render('edit', {
            title: 'Song',
            id: req.params.id,
            properties: Object.getOwnPropertyNames(row)
                .filter((prop) => SongSchema.properties.hasOwnProperty(prop))
                .map((prop) => ({
                    type: presentationModeToHtmlType(
                        SongSchema.properties[prop].presentationMode,
                        SongSchema.properties[prop].type
                    ),
                    required: SongSchema.required.includes(prop),
                    attrs: columnConstraintToHtmlAttrs(
                        SongSchema.properties[prop]
                    ),
                    name: prop,
                    value: row[prop],
                })),
            references: Object.getOwnPropertyNames(row)
                .filter((prop) =>
                    SongSchema.references.find(
                        (ref) => `${ref.model}_id`.toLowerCase() === prop
                    )
                )
                .map((prop) =>
                    SongSchema.references.find(
                        (ref) => `${ref.model}_id`.toLowerCase() === prop
                    )
                )
                .map((ref) => ({
                    name: `${ref.model}_id`.toLowerCase(),
                    label: ref.label,
                    model: ref.model,
                    values:
                        ref.relation === 'M-M'
                            ? 'Song/' + req.params.id
                            : row[(ref.model + '_id').toLowerCase()],
                    isManyToMany: ref.relation === 'M-M',
                })),
            get hasReferences() {
                return this.references.length > 0;
            },
        });
    });
});

module.exports = router;