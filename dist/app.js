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
            const data = this.extractor.getClassMethods(ast);
            results.push({ filePath: filePath, originalSource: source, data });
        });
        return results;
    }
}
exports.App = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLG1DQUE4QztBQUM5QywwREFBNkI7QUFDN0Isd0RBQTBCO0FBQzFCLHFDQUFxQztBQUNyQywyQ0FBNEM7QUFDNUMsZ0RBQXdCO0FBRXhCLE1BQWEsR0FBRztJQUlkO1FBQ0UsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGtCQUFTLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUkseUJBQWEsRUFBRSxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxjQUFjLENBQUMsTUFBYyxFQUFFLGNBQXdCLENBQUMsT0FBTyxDQUFDO1FBQzlELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7UUFFNUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1Q0FBdUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUM5RCxNQUFNLEtBQUssR0FBRyxtQkFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVqQyxNQUFNLElBQUksR0FBRyxFQUFFLENBQUM7UUFFaEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsb0JBQW9CLENBQUMsUUFBZ0I7UUFDbkMsTUFBTSxZQUFZLEdBQUc7WUFDbkIsV0FBVyxFQUFFLE1BQU07WUFDbkIsVUFBVSxFQUFFLE9BQU87WUFDbkIsR0FBRyxFQUFFLCtCQUErQjtZQUNwQyxXQUFXLEVBQUUsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDO1lBQzlELGFBQWEsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsWUFBWSxDQUFDO1lBQ2pELFVBQVUsRUFBRTtnQkFDVixHQUFHLEVBQUUsbUNBQW1DO2dCQUN4QyxPQUFPLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQzthQUNsQztTQUNGLENBQUM7UUFFRixPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzFELGlCQUFTLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxlQUFlLENBQUMsTUFBYztRQUM1QixPQUFPLGdCQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUMzRCxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ3RELENBQUM7SUFDSixDQUFDO0lBRUQsVUFBVSxDQUFDLEtBQWU7UUFDeEIsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDbkIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBRXBCLElBQUksQ0FBQyxjQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUMxQixRQUFRLEdBQUcsY0FBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7YUFDNUI7WUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsQ0FBQztZQUVuQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRWpELE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNyRSxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7Q0FDRjtBQW5FRCxrQkFtRUMifQ==