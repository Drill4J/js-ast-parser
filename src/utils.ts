import { writeJson } from 'fs-extra';
import recursive from 'recursive-readdir-synchronous';
import axios from 'axios';
import { async } from 'rxjs/internal/scheduler/async';
import { AstParser } from './parser';
import { DataExtractor } from './extractor';
import path from 'path';

export function writeFile(name, object) {
  writeJson(name, object, { spaces: 2 }, err => {
    if (err) return console.error(err);

    console.log('success!');
  });
}

export function getFiles(path: string, ignoreFiles: string[]) {
  return recursive(path, ignoreFiles);
}

export function saveData(url: string, data) {
  if (url) {
    axios
      .post(url, data, {
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  } else {
    console.log(`no url provided\n ${JSON.stringify(data, null, 2)}`);
  }
}

export function parseFiles(files) {}
