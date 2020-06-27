const mustache = require('mustache');
const { promises: fs } = require('fs');

const config = require('../server/config.json');

const BACKOFFICE_MUSTACHE = './backoffice/backoffice.mustache';

const createView = (configSchemas) => ({
    schemas: configSchemas.map((cs) => ({
        title: cs.name,
    })),
});

async function generate(configSchemas) {
    try {
        const data = await fs.readFile(BACKOFFICE_MUSTACHE);
        const output = mustache.render(
            data.toString(),
            createView(configSchemas)
        );
        await fs.writeFile(
            `./${config.baseGenFolder}/controllers/backoffice.js`,
            output
        );
    } catch (e) {
        console.log('Error catched', e);
    }
}

module.exports = {
    generate,
};
