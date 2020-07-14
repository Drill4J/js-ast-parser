"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const recursive_readdir_synchronous_1 = __importDefault(require("recursive-readdir-synchronous"));
const axios_1 = __importDefault(require("axios"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx1Q0FBcUM7QUFDckMsa0dBQXNEO0FBQ3RELGtEQUEwQjtBQUUxQixTQUFnQixTQUFTLENBQUMsSUFBSSxFQUFFLE1BQU07SUFDcEMsb0JBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1FBQzNDLElBQUksR0FBRztZQUFFLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVuQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQU5ELDhCQU1DO0FBRUQsU0FBZ0IsUUFBUSxDQUFDLElBQVksRUFBRSxXQUFxQjtJQUMxRCxPQUFPLHVDQUFTLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3RDLENBQUM7QUFGRCw0QkFFQztBQUVELFNBQWdCLFFBQVEsQ0FBQyxHQUFXLEVBQUUsSUFBSTtJQUN4QyxJQUFJLEdBQUcsRUFBRTtRQUNQLGVBQUs7YUFDRixJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRTtZQUNmLE9BQU8sRUFBRSxFQUFFLGNBQWMsRUFBRSxnQ0FBZ0MsRUFBRTtTQUM5RCxDQUFDO2FBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEIsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ1gsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyQixDQUFDLENBQUMsQ0FBQztLQUNOO1NBQU07UUFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUM7S0FDNUM7QUFDSCxDQUFDO0FBZkQsNEJBZUM7QUFFRCxTQUFnQixVQUFVLENBQUMsS0FBSyxJQUFHLENBQUM7QUFBcEMsZ0NBQW9DIn0=