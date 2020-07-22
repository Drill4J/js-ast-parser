"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const recursive_readdir_synchronous_1 = __importDefault(require("recursive-readdir-synchronous"));
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
function writeFile(name, object) {
    fs_extra_1.writeJson(name, object, { spaces: 2 }, err => {
        if (err)
            return console.error(err);
        console.log('success!');
    });
}
exports.writeFile = writeFile;
function getFiles(path, ignoreFiles) {
    return recursive_readdir_synchronous_1.default(path, ignoreFiles);
}
exports.getFiles = getFiles;
function saveData(url, data) {
    if (url) {
        axios_1.default
            .post(url, data, {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        })
            .then(res => {
            console.log(res.data);
        })
            .catch(err => {
            console.error(err);
        });
    }
    else {
        console.log(`no url provided in config\n`);
    }
}
exports.saveData = saveData;
function parseFiles(files) { }
exports.parseFiles = parseFiles;
function stringifyAndHash(object) {
    const fingerprint = JSON.stringify(object);
    const hash = crypto_1.default
        .createHash("sha256")
        .update(fingerprint)
        .digest("hex");
    return hash;
}
exports.stringifyAndHash = stringifyAndHash;
//# sourceMappingURL=utils.js.map