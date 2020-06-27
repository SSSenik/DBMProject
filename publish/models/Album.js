const jsf = require('json-schema-faker');
const faker = require('faker');

const database = require(__basedir + '/database/sqlite-wrapper.js')(__basedir + '/database/database.db')

jsf.extend('faker', () => faker);

const schemaAlbum = require('../schemas/Schema-Album.json');

class Album {
    constructor(name, description, release_date, cover) {
        this.name = name;
        this.description = description;
        this.release_date = release_date;
        this.cover = cover;

        Object.defineProperty(this, 'id', { enumerable: false, writable: true } );
        Object.defineProperty(this, 'description', { enumerable: false });
        Object.defineProperty(this, 'cover', { enumerable: false });
        Object.defineProperty(this, 'artist_id', { enumerable: false, writable: true });
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

    static top(property, order, limit, callback) {
        database.where(
            `SELECT * FROM Album ORDER BY ${property} ${order} LIMIT ${limit}`,
            [],
            Album,
            callback
        );
    }

    static getLastInserted(callback) {
        this.top('id', 'DESC', 1, callback);
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
    
    static manyDelete(model, id, callback) {
        let tablename = ['Album', model].sort().join('_');
        database.run(
            `DELETE FROM ${tablename}
        WHERE ${tablename}.${'Album'.toLowerCase()}_id = ?`,
            [id],
            callback
        );
    }

    static manyInsert(model, id, values) {
        let tablename = ['Album', model].sort().join('_');
        for (const refid of values) {
            database.run(
                `INSERT INTO ${tablename} (${'Album'.toLowerCase()}_id, ${model.toLowerCase()}_id) VALUES (?, ?)`,
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
            database.run(`UPDATE Album SET name = ?,description = ?,release_date = ?,cover = ?,artist_id = ? WHERE id = ?`, 
            [this.name,this.description,this.release_date,this.cover,this.artist_id, this.id], callback);
        } else{
            database.run(`INSERT INTO Album (name, description, release_date, cover,artist_id) VALUES (?,?,?,?,?)`, 
            [this.name,this.description,this.release_date,this.cover,this.artist_id], callback);
        }
    }



}


module.exports = Album