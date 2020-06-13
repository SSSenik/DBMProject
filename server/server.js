const childProcess = require('child_process');
const del = require('del');
const mkdirp = require('mkdirp');
const mustache = require('mustache');
const { promises: fs } = require('fs');

const config = require('./config.json');
const generateClass = require('../models/generate-class');
const generateDatabase = require('../database/generate-database');
const generateApis = require('../restful-api/generate-api');

const SERVER_MUSTACHE = './server/server.mustache';

async function genFolderTree() {
    console.log('GENERATING FOLDER TREE...');
    await del([config.baseGenFolder]).then(() => {
        mkdirp.sync(`./${config.baseGenFolder}/controllers`);
        mkdirp.sync(`./${config.baseGenFolder}/models`);
        mkdirp.sync(`./${config.baseGenFolder}/public/css`);
        mkdirp.sync(`./${config.baseGenFolder}/public/js`);
        mkdirp.sync(`./${config.baseGenFolder}/public/html`);
        mkdirp.sync(`./${config.baseGenFolder}/views`);
        mkdirp.sync(`./${config.baseGenFolder}/schemas`);
        mkdirp.sync(`./${config.baseGenFolder}/database`);
    });
}

async function copyStaticFiles() {
    console.log('COPYING STATIC FILES...');
    Object.keys(config.staticFiles).forEach(async (name) => {
        try {
            await fs.copyFile(
                `.${config.staticFiles[name].originalPath}`,
                `./${config.baseGenFolder}${config.staticFiles[name].destinationPath}`
            );
        } catch (e) {
            console.log('Error catched', e);
        }
    });
}

async function generateDataStructure() {
    console.log('GENERATING DATA STRUCTURES...');
    await generateClass.generate(config.schemas);
    await generateDatabase.generate(config.dbname, config.schemas);
    await generateDatabase.generateRelationships(config.dbname, config.schemas);
    await generateApis.generate(config.schemas);
}

const createIndexView = () => ({
    port: config.port,
    schemaApis: config.schemas.map((schema) => ({
        title: schema.name,
    })),
});
async function generateIndex() {
    console.log('GENERATING SERVER FILE...');
    const data = await fs.readFile(SERVER_MUSTACHE);
    const output = mustache.render(data.toString(), createIndexView());
    await fs.writeFile(`./${config.baseGenFolder}/index.js`, output);
    childProcess.fork('./publish/index.js');
}

async function generateServer() {
    try {
        await genFolderTree();
        await copyStaticFiles();
        await generateDataStructure();
        await generateIndex();
    } catch (e) {
        console.log('Error catched', e);
    }
}

module.exports = { generateServer };
