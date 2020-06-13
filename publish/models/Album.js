const jsf = require('json-schema-faker');
const faker = require('faker');

const database = require(__basedir + '/database/sqlite-wrapper.js')(__basedir + '/database/database.db')

jsf.extend('faker', () => faker);

const schemaAlbum = require('../schemas/Schema-Album.json');

class Album {
    constructor(name, description, realease_date) {
        this.name = name;
        this.description = description;
        this.realease_date = realease_date;

        Object.defineProperty(this, 'description', { enumerable: false });
        Object.defineProperty(this, 'realease_date', { enumerable: false });
        Object.defineProperty(this, 'id', { enumerable: false, writable: true } );
    }

    static create() {
        return Object.assign(new Album(), jsf.generate(schemaAlbum));
    }

    static all(callback) {
        database.where("SELECT * FROM Album", [], Album, callback)
    }

    static get(id, callback) {
        database.get("SELECT * FROM Album WHERE id = ?", [id], Album, callback)
    }

    static delete(id, callback) {
        database.run("DELETE FROM Album WHERE id = ?", [id], callback)
    }

    save(callback) {
        if (this.id) {
            database.run(`UPDATE Album SET name = ?, description = ?, realease_date = ?  WHERE id = ?`, 
            [this.name, this.description, this.realease_date, this.id], callback);
        } else{
            database.run(`INSERT INTO Album (name, description, realease_date) VALUES (?,?,?)`, 
            [this.name, this.description, this.realease_date], callback);
        }
    }

}


module.exports = Album