#!/usr/bin/env node
import program from 'commander';
import { AstParser } from './parser';
import { DataExtractor } from './extractor';
import { saveData, getFiles, parseFiles } from './utils';
import { readFileSync } from 'fs';

program
  .requiredOption('-c, --cfg <path>', 'path to config.json file')
  .parse(process.argv);

let cfg = readFileSync(program.cfg)

let config = JSON.parse(cfg.toString())

parseFiles(config.dir, config.url, config.ignoreFiles, config.ignoreFolders)



