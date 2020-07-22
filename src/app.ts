import { Config } from './model/config';
import { writeFile, getFiles, stringifyAndHash } from './utils';
import glob from 'fast-glob';
import fs from 'fs-extra';
import { AstParser } from './parser';
import { DataExtractor } from './extractor';
import path from 'path';

export class App {
  private parser: AstParser;
  private extractor: DataExtractor;

  constructor() {
    this.parser = new AstParser();
    this.extractor = new DataExtractor();
  }

  findSourceMaps(config: Config, blobPattern: string[] = ['*.map']) {
    const pattern = config.sourceMaps ? config.sourceMaps.pattern : blobPattern;

    console.log(`Searching source maps using pattern ${pattern}`);
    const files = glob.sync(pattern);

    const data = [];

    files.forEach(f => {
      console.log(`Reading source map file ${f}`);
      data.push(JSON.parse(fs.readFileSync(f, 'utf8')));
    });

    return data;
  }

  generateSampleConfig(fileName: string) {
    const configSample = {
      projectName: 'demo',
      source_dir: './src',
      url: 'http://localhost:8081/saveAst',
      ignoreFiles: ['*.js.map', '*.js', '*.html', '*.css', '*.json'],
      ignoreFolders: ['libs', 'coverage', 'interfaces'],
      sourceMaps: {
        url: 'http://localhost:3000/source-maps',
        pattern: ['./dist/main.*.js.map'],
      },
    };

    console.log(`Creating sample config file at ${fileName}`);
    writeFile(fileName, configSample);
  }

  findSourceFiles(config: Config) {
    return getFiles(config.source_dir, config.ignoreFiles).filter(
      it => !config.ignoreFolders.some(x => it.includes(x))
    );
  }

  parseFiles(files: string[]): any {
    let results = [];
    files.forEach(file => {
      let filePath = file;

      if (!path.isAbsolute(file)) {
        filePath = path.sep + file;
      }

      console.log('Parsing ' + filePath);

      const { source, ast } = this.parser.parse(file);
      const { source: _, ast: astWithoutLocationInfo } = this.parser.parse(file, false);
      
      const data = this.extractor.getClassMethods(ast);
      const withoutLocInfo = this.extractor.getClassMethods(astWithoutLocationInfo);
      data.methods = addChecksums(data.methods, withoutLocInfo.methods);
      results.push({ filePath: filePath, originalSource: source, data });
    });

    return results;
  }
}

function addChecksums(methods, methodsWithoutLocInfo) {
  if (!Array.isArray(methods)) {
    throw new Error('methods expected to be an array');
  }
  if (!Array.isArray(methodsWithoutLocInfo)) {
    throw new Error('methodsWithoutLocInfo expected to be an array');
  }
  if (methods.length != methodsWithoutLocInfo.length) {
    throw new Error('methods with and without loc info count mismatch');
  }
  return methods.map((method, i) => ({
    ...method,
    checksum: stringifyAndHash(methodsWithoutLocInfo[i].body)
  }))
}