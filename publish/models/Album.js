const jsf = require('json-schema-faker');
const faker = require('faker');

const database = require(__basedir + '/database/sqlite-wrapper.js')(__basedir + '/database/database.db')

jsf.extend('faker', () => faker);

const schemaAlbum = require('../schemas/Schema-Album.json');

class Album {
    constructor(name, description, release_date) {
        this.name = name;
        this.description = description;
        this.release_date = release_date;

        Object.defineProperty(this, 'id', { enumerable: false, writable: true } );
        Object.defineProperty(this, 'description', { enumerable: false });
        Object.defineProperty(this, 'release_date', { enumerable: false });
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
    
    static many(model, id, callback) {
        let tablename = ['Album', model].sort().join('_');
        database.where(
            `SELECT Album.*
        FROM Album
        INNER JOIN ${tablename} ON ${tablename}.${('Album').toLowerCase()}_id = Album.id
        WHERE ${tablename}.${model.toLowerCase()}_id = ?`,
            [id],
            Album,
            callback
        );
    }

    save(callback) {
        if (this.id) {
            database.run(`UPDATE Album SET name = ?,description = ?,release_date = ? WHERE id = ?`, 
            [this.name,this.description,this.release_date, this.id], callback);
        } else{
            database.run(`INSERT INTO Album (name, description, release_date) VALUES (?,?,?)`, 
            [this.name,this.description,this.release_date], callback);
        }
    }



}


module.exports = Album