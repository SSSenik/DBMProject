const jsf = require('json-schema-faker');
const faker = require('faker');

const database = require(__basedir + '/database/sqlite-wrapper.js')(__basedir + '/database/database.db')

jsf.extend('faker', () => faker);

const schemaArtist = require('../schemas/Schema-Artist.json');

class Artist {
    constructor(name, contact) {
        this.name = name;
        this.contact = contact;

        Object.defineProperty(this, 'id', { enumerable: false, writable: true } );
        Object.defineProperty(this, 'contact', { enumerable: false });
    }

    static create() {
        return Object.assign(new Artist(), jsf.generate(schemaArtist));
    }

    static all(callback) {
        database.where("SELECT * FROM Artist", [], Artist, callback)
    }

    static get(id, callback) {
        database.get("SELECT * FROM Artist WHERE id = ?", [id], Artist, callback)
    }

    static delete(id, callback) {
        database.run("DELETE FROM Artist WHERE id = ?", [id], callback)
    }
    
    static many(model, id, callback) {
        let tablename = ['Artist', model].sort().join('_');
        database.where(
            `SELECT Artist.*
        FROM Artist
        INNER JOIN ${tablename} ON ${tablename}.${('Artist').toLowerCase()}_id = Artist.id
        WHERE ${tablename}.${model.toLowerCase()}_id = ?`,
            [id],
            Artist,
            callback
        );
    }

    save(callback) {
        if (this.id) {
            database.run(`UPDATE Artist SET name = ?,contact = ? WHERE id = ?`, 
            [this.name,this.contact, this.id], callback);
        } else{
            database.run(`INSERT INTO Artist (name, contact) VALUES (?,?)`, 
            [this.name,this.contact], callback);
        }
    }



}


module.exports = Artist