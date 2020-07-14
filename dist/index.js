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
    .option('-b, --branch <name>', 'branch name', 'master')
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
console.log(` Branch: ${commander_1.default.branch} \n-----`);
const files = utils_1.getFiles(config.source_dir, config.ignoreFiles).filter(it => !config.ignoreFolders.some(x => it.includes(x)));
const data = app.parseFiles(files);
console.log('Saving ast data...');
const result = {
    branch: commander_1.default.branch,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsMERBQWdDO0FBQ2hDLHVDQUF3QztBQUN4QywrQkFBNEI7QUFDNUIsbUNBQTZDO0FBRTdDLG1CQUFPO0tBQ0osTUFBTSxDQUFDLHFCQUFxQixFQUFFLDBCQUEwQixDQUFDO0tBQ3pELE1BQU0sQ0FBQyw4QkFBOEIsRUFBRSx3QkFBd0IsQ0FBQztLQUNoRSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsb0JBQW9CLENBQUM7S0FDaEQsTUFBTSxDQUFDLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQztLQUN6QyxNQUFNLENBQUMscUJBQXFCLEVBQUUsYUFBYSxFQUFFLFFBQVEsQ0FBQztLQUN0RCxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRXZCLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxFQUFFLENBQUM7QUFFdEIsSUFBSSxtQkFBTyxDQUFDLGNBQWMsRUFBRTtJQUMxQixHQUFHLENBQUMsb0JBQW9CLENBQUMsbUJBQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNqRCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ2pCO0FBRUQsSUFBSSxDQUFDLG1CQUFPLENBQUMsTUFBTSxFQUFFO0lBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsMERBQTBELENBQUMsQ0FBQztDQUM3RTtBQUVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsdUJBQVksQ0FBQyxtQkFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFFbkUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsTUFBTSxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUM7QUFDckUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLG1CQUFPLENBQUMsTUFBTSxVQUFVLENBQUMsQ0FBQztBQUVsRCxNQUFNLEtBQUssR0FBRyxnQkFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FDbEUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUN0RCxDQUFDO0FBRUYsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUVuQyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFFbEMsTUFBTSxNQUFNLEdBQUc7SUFDYixNQUFNLEVBQUUsbUJBQU8sQ0FBQyxNQUFNO0lBQ3RCLElBQUksRUFBRSxJQUFJO0NBQ1gsQ0FBQztBQUVGLGdCQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUU3QixJQUFJLG1CQUFPLENBQUMsVUFBVSxFQUFFO0lBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsOENBQThDLENBQUMsQ0FBQztJQUM1RCxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDZixnQkFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLENBQUMsQ0FBQyxDQUFDO0NBQ0oifQ==