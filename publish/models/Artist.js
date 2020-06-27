const jsf = require('json-schema-faker');
const faker = require('faker');

const database = require(__basedir + '/database/sqlite-wrapper.js')(__basedir + '/database/database.db')

jsf.extend('faker', () => faker);

const schemaArtist = require('../schemas/Schema-Artist.json');

class Artist {
    constructor(name, email) {
        this.name = name;
        this.email = email;

        Object.defineProperty(this, 'id', { enumerable: false, writable: true } );
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

    static top(property, order, limit, callback) {
        database.where(
            `SELECT * FROM Artist ORDER BY ${property} ${order} LIMIT ${limit}`,
            [],
            Artist,
            callback
        );
    }

    static getLastInserted(callback) {
        this.top('id', 'DESC', 1, callback);
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
    
    static manyDelete(model, id, callback) {
        let tablename = ['Artist', model].sort().join('_');
        database.run(
            `DELETE FROM ${tablename}
        WHERE ${tablename}.${'Artist'.toLowerCase()}_id = ?`,
            [id],
            callback
        );
    }

    static manyInsert(model, id, values) {
        let tablename = ['Artist', model].sort().join('_');
        for (const refid of values) {
            database.run(
                `INSERT INTO ${tablename} (${'Artist'.toLowerCase()}_id, ${model.toLowerCase()}_id) VALUES (?, ?)`,
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
            database.run(`UPDATE Artist SET name = ?,email = ? WHERE id = ?`, 
            [this.name,this.email, this.id], callback);
        } else{
            database.run(`INSERT INTO Artist (name, email) VALUES (?,?)`, 
            [this.name,this.email], callback);
        }
    }



}


module.exports = Artist