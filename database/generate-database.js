const mustache = require('mustache');
const { promises: fs } = require('fs');
const sqlite3 = require('sqlite3').verbose();

const config = require('../server/config.json');

const DBSCRIPT_MUSTACHE = './database/dbscript.mustache';
const ONE_ONE_MUSTACHE = './database/relationships/one-to-one.mustache';
const ONE_MANY_MUSTACHE = './database/relationships/one-to-many.mustache';
const MANY_MANY_MUSTACHE = './database/relationships/many-to-many.mustache';

const sqliteTypeTranslator = {
    integer: 'INTEGER',
    string: 'TEXT',
    object: 'BLOB',
    array: 'BLOB',
    boolean: 'INTEGER',
};

const createTableView = (schema) => ({
    tableName: schema.title,
    columns: Object.keys(schema.properties).map((columnName, i, arr) => ({
        name: columnName,
        type: sqliteTypeTranslator[schema.properties[columnName].type],
        null: schema.required.find((name) => name === columnName)
            ? 'NOT NULL'
            : 'NULL',
        unique: schema.properties[columnName].unique && 'UNIQUE',
        constraint: buildConstraints(columnName, schema.properties[columnName]),
        hasComma: i !== arr.length - 1,
    })),
});

const createRelationshipQuery = async (schemaTitle, ref) => {
    try {
        let mustString = '';
        let mustData = {};
        switch (ref.relation) {
            case '1-1':
                mustString = await fs.readFile(ONE_ONE_MUSTACHE);
                mustData = {
                    tableName: schemaTitle,
                    refColumnName: `${ref.model}_id`.toLowerCase(),
                    refTableName: ref.model,
                    indexName: `${ref.model}_unique`,
                };
                break;
            case '1-M':
                mustString = await fs.readFile(ONE_MANY_MUSTACHE);
                mustData = {
                    tableName: schemaTitle,
                    refColumnName: `${ref.model}_id`.toLowerCase(),
                    refTableName: ref.model,
                };
                break;
            case 'M-M':
                mustString = await fs.readFile(MANY_MANY_MUSTACHE);
                mustData = {
                    tableName: [schemaTitle, ref.model].sort().join('_'),
                    modelCol: `${schemaTitle}_id`.toLowerCase(),
                    refCol: `${ref.model}_id`.toLowerCase(),
                    modelTable: schemaTitle,
                    refTable: ref.model,
                };
                break;
            default:
                break;
        }
        if (!mustString.toString() || !mustData) return;
        return mustache.render(mustString.toString(), mustData);
    } catch (err) {
        console.log('Error catched', err);
    }
};

function buildConstraints(columnName, column) {
    let constraint = '';
    Object.keys(column).forEach((prop) => {
        switch (prop) {
            case 'maxLength':
                constraint += `LENGTH(${columnName}) <= ${column[prop]} AND `;
                break;
            case 'maximum':
                constraint += `${columnName} <= ${column[prop]} AND `;
                break;
            case 'minimum':
                constraint += `${columnName} >= ${column[prop]} AND `;
                break;
            default:
                break;
        }
    });
    if (constraint) {
        return `CHECK(${constraint.substring(0, constraint.length - 5)})`;
    }
    return;
}

async function generate(dbname, schemas) {
    const db = new sqlite3.Database(
        `./${config.baseGenFolder}/database/${dbname}`,
        (err) => {
            if (err) return console.error(err.message);
            console.log('Connected to SQLite database.');
        }
    );

    try {
        const data = await fs.readFile(DBSCRIPT_MUSTACHE);
        for (const schema of schemas) {
            await new Promise((res, rej) => {
                db.run(
                    mustache.render(
                        data.toString(),
                        createTableView(require(`.${schema.path}`))
                    ),
                    (err) => {
                        if (err) {
                            rej(err); // optional: again, you might choose to swallow this error.
                        } else {
                            res(); // resolve the promise
                        }
                    }
                );
            });
        }
    } catch (e) {
        console.log('Error catched', e);
    }

    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
    });
}

async function generateRelationships(dbname, schemas) {
    const db = new sqlite3.Database(
        `./${config.baseGenFolder}/database/${dbname}`,
        (err) => {
            if (err) return console.error(err.message);
            console.log('Connected to SQLite database.');
        }
    );

    for (const s of schemas) {
        const schema = require(`.${s.path}`);
        if (!schema.references.length) continue;

        for (const ref of schema.references) {
            try {
                db.run(await createRelationshipQuery(schema.title, ref));
            } catch (err) {
                console.log('Error catched', err);
            }
        }
    }

    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
    });
}

module.exports = {
    generate,
    generateRelationships,
};
