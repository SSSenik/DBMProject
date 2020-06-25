const jsf = require('json-schema-faker');
const faker = require('faker');

const database = require(__basedir + '/database/sqlite-wrapper.js')(__basedir + '/database/database.db')

jsf.extend('faker', () => faker);

const schemaGenre = require('../schemas/Schema-Genre.json');

class Genre {
    constructor(name) {
        this.name = name;

        Object.defineProperty(this, 'id', { enumerable: false, writable: true } );
    }

    static create() {
        return Object.assign(new Genre(), jsf.generate(schemaGenre));
    }

    static all(callback) {
        database.where("SELECT * FROM Genre", [], Genre, callback)
    }

    static get(id, callback) {
        database.get("SELECT * FROM Genre WHERE id = ?", [id], Genre, callback)
    }

    static delete(id, callback) {
        database.run("DELETE FROM Genre WHERE id = ?", [id], callback)
    }
    
    static many(model, id, callback) {
        let tablename = ['Genre', model].sort().join('_');
        database.where(
            `SELECT Genre.*
        FROM Genre
        INNER JOIN ${tablename} ON ${tablename}.${('Genre').toLowerCase()}_id = Genre.id
        WHERE ${tablename}.${model.toLowerCase()}_id = ?`,
            [id],
            Genre,
            callback
        );
    }

    save(callback) {
        if (this.id) {
            database.run(`UPDATE Genre SET name = ? WHERE id = ?`, 
            [this.name, this.id], callback);
        } else{
            database.run(`INSERT INTO Genre (name) VALUES (?)`, 
            [this.name], callback);
        }
    }



}


module.exports = Genre