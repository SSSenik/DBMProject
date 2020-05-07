const mustache = require('mustache');
const { promises: fs } = require('fs');

const config = require('../server/config.json');

const API_MUSTACHE = './restful-api/api.mustache';

const createView = (schema) => ({
    title: schema.title,
});

async function generate(schemas) {
    const data = await fs.readFile(API_MUSTACHE);
    schemas.forEach(async (schema) => {
        try {
            const output = mustache.render(
                data.toString(),
                createView(require(`.${schema.path}`))
            );
            await fs.writeFile(
                `./${config.baseGenFolder}/controllers/${schema.name}-api.js`,
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
