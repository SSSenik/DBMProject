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

    static top(property, order, limit, callback) {
        database.where(
            `SELECT * FROM Genre ORDER BY ${property} ${order} LIMIT ${limit}`,
            [],
            Genre,
            callback
        );
    }

    static getLastInserted(callback) {
        this.top('id', 'DESC', 1, callback);
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
    
    static manyDelete(model, id, callback) {
        let tablename = ['Genre', model].sort().join('_');
        database.run(
            `DELETE FROM ${tablename}
        WHERE ${tablename}.${'Genre'.toLowerCase()}_id = ?`,
            [id],
            callback
        );
    }

    static manyInsert(model, id, values) {
        let tablename = ['Genre', model].sort().join('_');
        for (const refid of values) {
            database.run(
                `INSERT INTO ${tablename} (${'Genre'.toLowerCase()}_id, ${model.toLowerCase()}_id) VALUES (?, ?)`,
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
            database.run(`UPDATE Genre SET name = ? WHERE id = ?`, 
            [this.name, this.id], callback);
        } else{
            database.run(`INSERT INTO Genre (name) VALUES (?)`, 
            [this.name], callback);
        }
    }



}


module.exports = Genre