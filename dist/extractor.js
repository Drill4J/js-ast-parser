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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2V4dHJhY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHlFQUFpRTtBQUNqRSx1RUFBa0U7QUFFbEUsTUFBYSxhQUFhO0lBRXRCLGdCQUFjLENBQUM7SUFFUixlQUFlLENBQUMsR0FBWTtRQUMvQixNQUFNLE9BQU8sR0FBRyxvQ0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBRW5DLElBQUssU0FBUyxHQUFHLHFDQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBRXRDLE1BQU0sSUFBSSxHQUFHO1lBQ1QsU0FBUyxFQUFFLFNBQVM7WUFDcEIsT0FBTyxFQUFHLE9BQU87U0FDcEIsQ0FBQTtRQUVELE9BQU8sSUFBSSxDQUFBO0lBQ2YsQ0FBQztDQUNKO0FBaEJELHNDQWdCQyJ9