const mustache = require('mustache');
const { promises: fs } = require('fs');
const sqlite3 = require('sqlite3').verbose();

const config = require('../server/config.json');
const {
    schemaTypeToSQLiteType,
    buildConstraints,
    createRelationshipQuery,
} = require('./utils');

const DBSCRIPT_MUSTACHE = './database/dbscript.mustache';

const createTableView = schema => ({
    tableName: schema.title,
    columns: Object.keys(schema.properties).map((columnName, i, arr) => ({
        name: columnName,
        type: schemaTypeToSQLiteType(schema.properties[columnName].type),
        null: schema.required.find(name => name === columnName)
            ? 'NOT NULL'
            : 'NULL',
        unique: schema.properties[columnName].unique ? 'UNIQUE' : '',
        constraint: buildConstraints(columnName, schema.properties[columnName]),
        hasComma: i !== arr.length - 1,
    })),
});

async function generate(dbname, schemas) {
    const db = new sqlite3.Database(
        `./${config.baseGenFolder}/database/${dbname}`,
        err => {
            if (err) return console.error(err.message);
            console.log('Connected to SQLite database.');
        }
    );

    try {
        const data = await fs.readFile(DBSCRIPT_MUSTACHE);
        for (const schema of schemas) {
            await new Promise((res, rej) => {
                const query = mustache.render(
                    data.toString(),
                    createTableView(require(`.${schema.path}`))
                );
                db.run(query, err => {
                    if (err) {
                        rej(err);
                    } else {
                        res();
                    }
                });
            });
        }
    } catch (e) {
        console.log('Error catched', e);
    }

    db.close(err => {
        if (err) {
            return console.error(err.message);
        }
    });
}

async function generateRelationships(dbname, schemas) {
    const db = new sqlite3.Database(
        `./${config.baseGenFolder}/database/${dbname}`,
        err => {
            if (err) return console.error(err.message);
            console.log('Connected to SQLite database.');
        }
    );

    for (const s of schemas) {
        const schema = require(`.${s.path}`);
        if (!schema.references.length) continue;

        for (const ref of schema.references) {
            try {
                const queries = await createRelationshipQuery(
                    schema.title,
                    ref
                );
                for (const q of queries) {
                    await new Promise((res, rej) => {
                        db.run(q, err => {
                            if (err) {
                                rej(err);
                            } else {
                                res();
                            }
                        });
                    });
                }
            } catch (err) {
                console.log('Error catched', err);
            }
        }
    }

    db.close(err => {
        if (err) {
            return console.error(err.message);
        }
    });
}

module.exports = {
    generate,
    generateRelationships,
};
