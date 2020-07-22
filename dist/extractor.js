"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extract_all_methods_1 = require("./analyzers/extract_all_methods");
const extract_class_name_1 = require("./analyzers/extract_class_name");
class DataExtractor {
    constructor() { }
    getClassMethods(ast) {
        const methods = extract_all_methods_1.extractMethods(ast);
        let className = extract_class_name_1.extractClassName(ast);
        const data = {
            className: className,
            methods: methods
        };
        return data;
    }
}
exports.DataExtractor = DataExtractor;
//# sourceMappingURL=extractor.js.map