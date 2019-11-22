#!/usr/bin/env ts-node
import program from 'commander';
import { AstParser } from './parser';

program
  .requiredOption('-f, --folder <path>', 'source code path should be specified');

program.parse(process.argv);

const parser = new AstParser()

if (program.folder){
    const ast = parser.parse(program.folder)
    console.log(ast)
}