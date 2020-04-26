const del = require('del');
const mkdirp = require('mkdirp');
const mustache = require('mustache');
const { promises: fs } = require('fs');

const config = require('./config.json');
const generateClass = require('../models/generate-class.js');
const generateDatabase = require('../models/generate-database.js');

async function createControllers() {
    await mkdirp('./publish/controllers');
}

async function createModels() {
    await mkdirp('./publish/models');
}

async function createPublic() {
    await mkdirp('./publish/public/css');
    await mkdirp('./publish/public/js');
    await mkdirp('./publish/public/html');
}

async function createViews() {
    await mkdirp('./publish/views');
}

async function createSchemas() {
    await mkdirp('./publish/schemas');
    generateClass.generate(config.schemas);
}

async function createDatabases() {
    await mkdirp('./publish/database');
    generateDatabase.generate(config.dbname, config.schemas);
}

async function generateIndex() {
    const data = await fs.readFile('./server/server.mustache');
    await fs.writeFile(
        './publish/index.js',
        mustache.render(data.toString(), config)
    );
}

async function resetPublish() {
    try {
        await del(['publish']);
        createControllers();
        createModels();
        createViews();
        createPublic();
        createSchemas();
        createDatabases();
        generateIndex();
    } catch (e) {
        console.log('Error catched', e);
    }
}

module.exports.resetPublish = resetPublish;
