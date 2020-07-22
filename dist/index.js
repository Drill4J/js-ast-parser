#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const fs_extra_1 = require("fs-extra");
const app_1 = require("./app");
const utils_1 = require("./utils");
commander_1.default
    .option('-c, --config <path>', 'path to config.json file')
    .option('-g, --generate-config <path>', 'generate sample config')
    .option('-s, --sourceMaps', 'upload source maps')
    .option('-o, --verbose', 'verbose output')
    .option('-b, --build-version <version>', 'build version')
    .parse(process.argv);
const app = new app_1.App();
if (commander_1.default.generateConfig) {
    app.generateSampleConfig(commander_1.default.generateConfig);
    process.exit(0);
}
if (!commander_1.default.config) {
    throw new Error('Config file should be provided as drill4js-cli -c <path>');
}
const config = JSON.parse(fs_extra_1.readFileSync(commander_1.default.config).toString());
console.log(`-----\n Start parsing project ${config.projectName}\n`);
console.log(` build: ${commander_1.default.buildVersion} \n-----`);
const files = utils_1.getFiles(config.source_dir, config.ignoreFiles).filter(it => !config.ignoreFolders.some(x => it.includes(x)));
const data = app.parseFiles(files);
console.log('Saving ast data...');
const result = {
    buildVersion: commander_1.default.buildVersion,
    data: data,
};
utils_1.saveData(config.url, result);
if (commander_1.default.sourceMaps) {
    console.log('-----\n Source files parsing anabled \n-----');
    const data = app.findSourceMaps(config);
    data.forEach(m => {
        utils_1.saveData(config.sourceMaps.url, m);
    });
}
//# sourceMappingURL=index.js.map