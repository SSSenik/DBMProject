const mustache = require('mustache');
const { promises: fs } = require('fs');

const config = require('../server/config.json');

const CLASS_MUSTACHE = './models/class.mustache';

const createView = (schema) => ({
    sqlitePath: `.${config.staticFiles.sqlite.destinationPath}`,
    dbName: config.dbname,
    classTitle: schema.title,
    constructorArguments: Object.keys(schema.properties).join(', '),
    classConstructor: Object.keys(schema.properties).map((prop) => ({
        name: prop,
    })),
    classEnumerables: Object.keys(schema.properties)
        .filter((prop) => schema.required.indexOf(prop) === -1)
        .map((prop) => ({ name: prop })),
});

function generate(schemas) {
    const data = await fs.readFile(CLASS_MUSTACHE);
    schemas.forEach(async (schema) => {
        try {
            await fs.copyFile(
                schema.path,
                `./${config.baseGenFolder}${schema.path.slice(1)}`
            );
            const output = mustache.render(
                data.toString(),
                createView(require(`.${schema.path}`))
            );
            await fs.writeFile(
                `./${config.baseGenFolder}/models/${schema.name}.js`,
                output
            );
        } catch (e) {
            console.log('Error catched', e);
        }
    });
}

module.exports = {
    generate,
};
