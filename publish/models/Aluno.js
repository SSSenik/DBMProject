const jsf = require('json-schema-faker');
const faker = require('faker');

const database = require('../database/sqlite-wrapper.js')('./database/database.db')

jsf.extend('faker', () => faker);

const schemaAluno = require('../schemas/Schema-Aluno.json');

class Aluno {
    constructor(id, numero, nome, email, morada, notafinal) {
        this.id = id
        this.numero = numero;
        this.nome = nome;
        this.email = email;
        this.morada = morada;
        this.notafinal = notafinal;

        Object.defineProperty(this, 'email', { enumerable: false });
        Object.defineProperty(this, 'morada', { enumerable: false });
        Object.defineProperty(this, id, { enumerable: false, writable: true } );
    }

    static create() {
        return Object.assign(new Aluno(), jsf.generate(schemaAluno));
    }

    static all(callback) {
        database.where("SELECT * FROM Aluno", [], Aluno, callback)
    }

    static get(id, callback) {
        database.get("SELECT * FROM Aluno WHERE id = ?", [id], Aluno, callback)
    }

    static delete(id, callback) {
        database.run("DELETE FROM Aluno WHERE id = ?", [id], callback)
    }

    save(callback) {
        if (this.id) {
            database.run(`UPDATE Aluno SET numero = ?, nome = ?, email = ?, morada = ?, notafinal = ?  WHERE id = ?`, 
            [this.numero, this.nome, this.email, this.morada, this.notafinal, this.id], callback);
        } else{
            database.run(`INSERT INTO Aluno (numero, nome, email, morada, notafinal) VALUES (?,?,?,?,?)`, 
            [this.numero, this.nome, this.email, this.morada, this.notafinal], callback);
        }
    }

}


module.exports = Aluno