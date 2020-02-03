import { writeJson } from 'fs-extra';
import recursive from 'recursive-readdir-synchronous';
import axios from 'axios';

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
    console.log(`no url provided in config\n`);
  }
}

export function parseFiles(files) {}
