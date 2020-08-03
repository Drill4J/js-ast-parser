"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    return __awaiter(this, void 0, void 0, function* () {
        if (!url) {
            throw new Error('no url provided in config');
        }
        return axios_1.default.post(url, data, {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        });
    });
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