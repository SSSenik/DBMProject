const jsf = require('json-schema-faker');
const faker = require('faker');

const database = require(.&#x2F;database&#x2F;sqlite-wrapper.js)(database.db)

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
        database.run("SELECT * FROM Aluno", {}, callback);
    }
}
