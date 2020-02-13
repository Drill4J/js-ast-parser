import { Config } from './model/config';
import { writeFile, getFiles } from './utils';
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

      const ast = this.parser.parse(file);
      const data = this.extractor.getClassMethods(ast);

      results.push({ filePath: filePath, data });
    });

    return results;
  }
}
