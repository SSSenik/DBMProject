const mustache = require('mustache');
const { promises: fs } = require('fs');
const sqlite3 = require('sqlite3').verbose();

const config = require('../server/config.json');

const DBSCRIPT_MUSTACHE = './database/dbscript.mustache';

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

    const data = await fs.readFile(DBSCRIPT_MUSTACHE);
    schemas.forEach((schema) => {
        try {
            db.run(
                mustache.render(
                    data.toString(),
                    createTableView(require(`.${schema.path}`))
                )
            );
        } catch (e) {
            console.log('Error catched', e);
        }
    });

    // close the database connection
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
    });
}

module.exports = {
    generate,
};
