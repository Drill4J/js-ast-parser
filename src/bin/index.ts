/*
 * Copyright 2020 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import axios from 'axios';
import upath from 'upath';
import program from 'commander';
import fsExtra from 'fs-extra';
import xxHashJs from 'xxhashjs';
import processSource from '../index';
import { Output } from './types';
import { findFilePaths, getConfig } from './utils';

process.on('uncaughtException', exceptionHandler);

program
  .requiredOption('-c, --config <path>', 'path to config file')
  .requiredOption('-b, --build-version <version>', 'build version')
  .option('-s, --skip-errors', 'skip files with processing errors')
  .option('--debug', 'debug mode, for development only')
  .parse(process.argv);

console.log('Program started\n');

const config = getConfig(program.config);
const bundleFiles = findBundleFiles(config.bundle);
const sourcemaps = findSourcemaps(config.sourcemaps);
const sourcePaths = findSourcePaths(config.sources);
const processedSources = processSources(sourcePaths);

const output: Output = {
  version: program.buildVersion,
  data: {
    bundleFiles,
    data: processedSources,
    sourcemaps,
  },
}
const { groupId } = config.output;
if (groupId) {
  output.groupId = groupId;
}
sendResults(config.output, output);

function processSources(paths) {
  console.log('Processing sources');
  const result = [];
  paths.forEach((path: string) => {
    try {
      console.log('\t', path);
      const source = fsExtra.readFileSync(path, 'utf8');
      const processedSource = processSource(source);
      processedSource.forEach(x =>
        result.push({
          path: config.output.omitPathPrefix ? path.replace(new RegExp(`^${config.output.omitPathPrefix}`),'') : path,
          suffix: x.name,
          methods: x.functions,
        }),
      );
    } catch (e) {
      console.log('\t failed to parse', path, 'due to\n', JSON.stringify(e), '\n');
      if (!program.skipErrors) {
        throw e;
      }
    }
  });
  console.log('Sources processed\n');
  return result;
}

function findBundleFiles({ pattern, ignore }) {
  console.log('Searching bundle files');
  const paths = findFilePaths(pattern, ignore);
  if (paths.length === 0 && !program.debug) {
    throw new Error('could not find bundle files');
  }
  console.log('Bundle files found:\n\t', paths.join('\n\t'), '\n');

  const result = paths.map(path => {
    const bundleFile = fsExtra.readFileSync(path, 'utf8');
    const hash = getHash(unifyLineEndings(bundleFile));
    return {
      file: path,
      source: bundleFile,
      hash,
    };
  });
  return result;
}

function getHash(data) {
  const seed = 0xABCD;
  const hashFn = xxHashJs.h32(seed);
  return hashFn.update(data).digest().toString(16);
}

function unifyLineEndings(str: string): string {
  // reference https://www.ecma-international.org/ecma-262/10.0/#sec-line-terminators
  const LF = '\u000A';
  const CRLF = '\u000D\u000A';
  const LS = '\u2028';
  const PS = '\u2029';
  return str.replace(RegExp(`(${CRLF}|${LS}|${PS})`, 'g'), LF);
}

function findSourcemaps({ pattern, ignore }) {
  console.log('Searching sourcemaps');
  const paths = findFilePaths(pattern, ignore);
  if (paths.length === 0 && !program.debug) throw new Error('could not find sourcemaps');
  console.log('Sourcemaps found:\n\t', paths.join('\n\t'), '\n');
  const result = paths.map(x => {
    const fileName = upath.basename(x);
    const sourcemap = fsExtra.readJSONSync(x, { encoding: 'utf-8' });
    return {
      sourcemap,
      fileName
    }
  });
  return result;
}

function findSourcePaths({ pattern, ignore }) {
  console.log('Searching sources');
  const result = findFilePaths(pattern, ignore);
  if (result.length === 0) throw new Error('could not find source files');
  console.log('Found sources:\n\t', result.join('\n\t'), '\n');
  return result;
}

async function sendResults({ agentId, agentApiUrl, path }, buildInfo) {
  if (path) {
    console.log('Write AST data to', path, '\n');
    await fsExtra.writeJSON(upath.join(path, `build-info.${Date.now()}.json`), buildInfo, { spaces: 2 });
  }

  if (agentApiUrl) {
    console.log('Send results to', agentApiUrl, '\n');
    await axios.post(`${agentApiUrl}/agents/${agentId}/plugins/test2code/build`, buildInfo, {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      maxContentLength: Infinity
    });
  }
  console.log('Program finished. Exiting...');
}

function exceptionHandler(error: unknown) {
  if (error instanceof Error) {
    console.log('Error:', error.message, '\n', error.stack);
  } else {
    console.log('Error:', JSON.stringify(error));
  }
  process.exit(1);
}
