#!/usr/bin/env node
import program from 'commander';
import { parseFiles } from './utils';
import { readFileSync } from 'fs';

program
  .requiredOption('-c, --cfg <path>', 'path to config.json file')
  .parse(process.argv);

let config = JSON.parse(readFileSync(program.cfg).toString())

parseFiles(config.projectName, config.source_dir, config.url, config.ignoreFiles, config.ignoreFolders)



