import { writeJson } from "fs-extra"
import recursive from "recursive-readdir";

export function writeFile(name, object){
    writeJson(name, object, {spaces:2}, err => {
        if (err) return console.error(err)
      
        console.log('success!')
      })
}

export function getFiles(path: string, ignore){
    let files;
    recursive(path ,ignore, function (err, files) {
        files = files;
    });
    return files;
}