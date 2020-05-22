const jsf = require('json-schema-faker');
const faker = require('faker');

const database = require('../database/sqlite-wrapper.js')('./database/database.db')

jsf.extend('faker', () => faker);

const schemaAlbum = require('../schemas/Schema-Album.json');

class Album {
    constructor(name, description, realeaseDate) {
        this.name = name;
        this.description = description;
        this.realeaseDate = realeaseDate;

        Object.defineProperty(this, 'description', { enumerable: false });
        Object.defineProperty(this, 'realeaseDate', { enumerable: false });
        Object.defineProperty(this, id, { enumerable: false, writable: true } );
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
            database.run(`UPDATE Album SET name = ?, description = ?, realeaseDate = ?  WHERE id = ?`, 
            [this.name, this.description, this.realeaseDate, this.id], callback);
        } else{
            database.run(`INSERT INTO Album (name, description, realeaseDate) VALUES (?,?,?)`, 
            [this.name, this.description, this.realeaseDate], callback);
        }
    }

}


module.exports = Album