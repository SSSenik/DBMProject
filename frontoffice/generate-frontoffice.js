const mustache = require('mustache');
const { promises: fs } = require('fs');

const config = require('../server/config.json');

const FRONTOFFICE_MUSTACHE = './frontoffice/frontoffice.mustache';

const createView = (configSchemas) => ({
    schemas: configSchemas.map((sch) => ({ title: sch.name })),
    tables: config.frontoffice.map((table) => ({
        title: table.model,
        orderColumn: table.property,
        order: table.order,
        itemAmount: table.limit,
    })),
});

async function generate(configSchemas) {
    try {
        const data = await fs.readFile(FRONTOFFICE_MUSTACHE);
        const output = mustache.render(
            data.toString(),
            createView(configSchemas)
        );
        await fs.writeFile(
            `./${config.baseGenFolder}/controllers/frontoffice.js`,
            output
        );
    } catch (e) {
        console.log('Error catched', e);
    }
}

module.exports = {
    generate,
};
