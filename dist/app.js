"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const fast_glob_1 = __importDefault(require("fast-glob"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const parser_1 = require("./parser");
const extractor_1 = require("./extractor");
const path_1 = __importDefault(require("path"));
class App {
    constructor() {
        this.parser = new parser_1.AstParser();
        this.extractor = new extractor_1.DataExtractor();
    }
    findSourceMaps(config, blobPattern = ['*.map']) {
        const pattern = config.sourceMaps ? config.sourceMaps.pattern : blobPattern;
        console.log(`Searching source maps using pattern ${pattern}`);
        const files = fast_glob_1.default.sync(pattern);
        const data = [];
        files.forEach(f => {
            console.log(`Reading source map file ${f}`);
            data.push(JSON.parse(fs_extra_1.default.readFileSync(f, 'utf8')));
        });
        return data;
    }
    generateSampleConfig(fileName) {
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
        utils_1.writeFile(fileName, configSample);
    }
    findSourceFiles(config) {
        return utils_1.getFiles(config.source_dir, config.ignoreFiles).filter(it => !config.ignoreFolders.some(x => it.includes(x)));
    }
    parseFiles(files) {
        let results = [];
        files.forEach(file => {
            let filePath = file;
            if (!path_1.default.isAbsolute(file)) {
                filePath = path_1.default.sep + file;
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
exports.App = App;
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
    return methods.map((method, i) => (Object.assign(Object.assign({}, method), { checksum: utils_1.stringifyAndHash(methodsWithoutLocInfo[i].body) })));
}
//# sourceMappingURL=app.js.map