const jsf = require('json-schema-faker');
const faker = require('faker');

const database = require(__basedir + '/database/sqlite-wrapper.js')(__basedir + '/database/database.db')

jsf.extend('faker', () => faker);

const schemaSong = require('../schemas/Schema-Song.json');

class Song {
    constructor(name, description, duration, lyrics, realease_date) {
        this.name = name;
        this.description = description;
        this.duration = duration;
        this.lyrics = lyrics;
        this.realease_date = realease_date;

        Object.defineProperty(this, 'description', { enumerable: false });
        Object.defineProperty(this, 'lyrics', { enumerable: false });
        Object.defineProperty(this, 'realease_date', { enumerable: false });
        Object.defineProperty(this, 'id', { enumerable: false, writable: true } );
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

    save(callback) {
        if (this.id) {
            database.run(`UPDATE Song SET name = ?, description = ?, duration = ?, lyrics = ?, realease_date = ?  WHERE id = ?`, 
            [this.name, this.description, this.duration, this.lyrics, this.realease_date, this.id], callback);
        } else{
            database.run(`INSERT INTO Song (name, description, duration, lyrics, realease_date) VALUES (?,?,?,?,?)`, 
            [this.name, this.description, this.duration, this.lyrics, this.realease_date], callback);
        }
    }

}


module.exports = Song