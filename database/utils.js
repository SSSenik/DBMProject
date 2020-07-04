const mustache = require('mustache');
const { promises: fs } = require('fs');

const UNIQUE_INDEX_MUSTACHE = './database/relationships/unique-index.mustache';
const ADD_FOREIGN_KEY_MUSTACHE =
    './database/relationships/add-foreign-key.mustache';
const MANY_MANY_TABLE_MUSTACHE =
    './database/relationships/many-to-many-table.mustache';

function schemaTypeToSQLiteType(type) {
    switch (type) {
        case 'integer':
        case 'range':
        case 'boolean':
            return 'integer';
        default:
            return 'text';
    }
}

function buildConstraints(columnName, column) {
    let constraint = '';
    Object.keys(column).forEach(prop => {
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

async function createRelationshipQuery(schemaTitle, ref) {
    try {
        let queriesData = [];
        switch (ref.relation) {
            case '1-1':
                queriesData.push({
                    mustString: await fs.readFile(ADD_FOREIGN_KEY_MUSTACHE),
                    mustData: {
                        tableName: schemaTitle,
                        refColumnName: `${ref.model}_id`.toLowerCase(),
                        refTableName: ref.model,
                    },
                });
                queriesData.push({
                    mustString: await fs.readFile(UNIQUE_INDEX_MUSTACHE),
                    mustData: {
                        tableName: schemaTitle,
                        refColumnName: `${ref.model}_id`.toLowerCase(),
                        indexName: `index_${ref.model}_${schemaTitle}`,
                    },
                });
                break;
            case '1-M':
                queriesData.push({
                    mustString: await fs.readFile(ADD_FOREIGN_KEY_MUSTACHE),
                    mustData: {
                        tableName: schemaTitle,
                        refColumnName: `${ref.model}_id`.toLowerCase(),
                        refTableName: ref.model,
                    },
                });
                break;
            case 'M-M':
                queriesData.push({
                    mustString: await fs.readFile(MANY_MANY_TABLE_MUSTACHE),
                    mustData: {
                        tableName: [schemaTitle, ref.model].sort().join('_'),
                        modelCol: `${schemaTitle}_id`.toLowerCase(),
                        refCol: `${ref.model}_id`.toLowerCase(),
                        modelTable: schemaTitle,
                        refTable: ref.model,
                    },
                });
                break;
            default:
                break;
        }
        if (!queriesData.length) return;
        return queriesData.map(q =>
            mustache.render(q.mustString.toString(), q.mustData)
        );
    } catch (err) {
        console.log('Error catched', err);
    }
}

module.exports = {
    schemaTypeToSQLiteType,
    buildConstraints,
    createRelationshipQuery,
};
