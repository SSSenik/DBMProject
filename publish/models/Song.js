const jsf = require('json-schema-faker');
const faker = require('faker');

const database = require(__basedir + '/database/sqlite-wrapper.js')(__basedir + '/database/database.db')

jsf.extend('faker', () => faker);

const schemaSong = require('../schemas/Schema-Song.json');

class Song {
    constructor(name, description, duration, lyrics, release_date, video_clip) {
        this.name = name;
        this.description = description;
        this.duration = duration;
        this.lyrics = lyrics;
        this.release_date = release_date;
        this.video_clip = video_clip;

        Object.defineProperty(this, 'id', { enumerable: false, writable: true } );
        Object.defineProperty(this, 'description', { enumerable: false });
        Object.defineProperty(this, 'lyrics', { enumerable: false });
        Object.defineProperty(this, 'video_clip', { enumerable: false });
        Object.defineProperty(this, 'album_id', { enumerable: false, writable: true });
        Object.defineProperty(this, 'genre_id', { enumerable: false, writable: true });
    }

    static create() {
        return Object.assign(new Song(), jsf.generate(schemaSong));
    }

    static all(callback) {
        database.where("SELECT * FROM Song", [], Song, callback)
    }

    static get(id, callback) {
        database.get("SELECT * FROM Song WHERE id = ?", [id], Song, callback)
    }

    static delete(id, callback) {
        database.run("DELETE FROM Song WHERE id = ?", [id], callback)
    }

    static top(property, order, limit, callback) {
        database.where(
            `SELECT * FROM Song ORDER BY ${property} ${order} LIMIT ${limit}`,
            [],
            Song,
            callback
        );
    }

    static getLastInserted(callback) {
        this.top('id', 'DESC', 1, callback);
    }
    
    static many(model, id, callback) {
        let tablename = ['Song', model].sort().join('_');
        database.where(
            `SELECT Song.*
        FROM Song
        INNER JOIN ${tablename} ON ${tablename}.${('Song').toLowerCase()}_id = Song.id
        WHERE ${tablename}.${model.toLowerCase()}_id = ?`,
            [id],
            Song,
            callback
        );
    }
    
    static manyDelete(model, id, callback) {
        let tablename = ['Song', model].sort().join('_');
        database.run(
            `DELETE FROM ${tablename}
        WHERE ${tablename}.${'Song'.toLowerCase()}_id = ?`,
            [id],
            callback
        );
    }

    static manyInsert(model, id, values) {
        let tablename = ['Song', model].sort().join('_');
        for (const refid of values) {
            database.run(
                `INSERT INTO ${tablename} (${'Song'.toLowerCase()}_id, ${model.toLowerCase()}_id) VALUES (?, ?)`,
                [id, refid]
            );
        }
    }

    static manySave(model, id, values) {
        this.manyDelete(model, id, () => {
            this.manyInsert(model, id, values);
        });
    }

    save(callback) {
        if (this.id) {
            database.run(`UPDATE Song SET name = ?,description = ?,duration = ?,lyrics = ?,release_date = ?,video_clip = ?,album_id = ?,genre_id = ? WHERE id = ?`, 
            [this.name,this.description,this.duration,this.lyrics,this.release_date,this.video_clip,this.album_id,this.genre_id, this.id], callback);
        } else{
            database.run(`INSERT INTO Song (name, description, duration, lyrics, release_date, video_clip,album_id,genre_id) VALUES (?,?,?,?,?,?,?,?)`, 
            [this.name,this.description,this.duration,this.lyrics,this.release_date,this.video_clip,this.album_id,this.genre_id], callback);
        }
    }



}


module.exports = Song