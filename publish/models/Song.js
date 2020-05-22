const jsf = require('json-schema-faker');
const faker = require('faker');

const database = require('../database/sqlite-wrapper.js')('./database/database.db')

jsf.extend('faker', () => faker);

const schemaSong = require('../schemas/Schema-Song.json');

class Song {
    constructor(name, description, duration, lyrics, realeaseDate) {
        this.name = name;
        this.description = description;
        this.duration = duration;
        this.lyrics = lyrics;
        this.realeaseDate = realeaseDate;

        Object.defineProperty(this, 'description', { enumerable: false });
        Object.defineProperty(this, 'lyrics', { enumerable: false });
        Object.defineProperty(this, 'realeaseDate', { enumerable: false });
        Object.defineProperty(this, id, { enumerable: false, writable: true } );
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
            database.run(`UPDATE Song SET name = ?, description = ?, duration = ?, lyrics = ?, realeaseDate = ?  WHERE id = ?`, 
            [this.name, this.description, this.duration, this.lyrics, this.realeaseDate, this.id], callback);
        } else{
            database.run(`INSERT INTO Song (name, description, duration, lyrics, realeaseDate) VALUES (?,?,?,?,?)`, 
            [this.name, this.description, this.duration, this.lyrics, this.realeaseDate], callback);
        }
    }

}


module.exports = Song