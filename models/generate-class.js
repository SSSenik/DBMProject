const mustache = require('mustache');
const { promises: fs } = require('fs');

const classModel = './models/class.mustache';

const createView = (schema) => ({
    classTitle: schema.title,
    constructorArguments: Object.keys(schema.properties).join(', '),
    classConstructor: Object.keys(schema.properties).map((prop) => ({
        name: prop,
    })),
    classEnumerables: Object.keys(schema.properties)
        .filter((prop) => schema.required.indexOf(prop) === -1)
        .map((prop) => ({ name: prop })),
});

module.exports.generate = (schemas) => {
    schemas.forEach(async (schema) => {
        try {
            await fs.copyFile(schema.path, `./publish${schema.path.slice(1)}`);
            const data = await fs.readFile(classModel);
            const output = mustache.render(
                data.toString(),
                createView(require(`.${schema.path}`))
            );
            await fs.writeFile(`./publish/models/${schema.name}.js`, output);
            console.log('CREATED ALUNOS');
        } catch (e) {
            console.log('Error catched', e);
        }
    });
};
