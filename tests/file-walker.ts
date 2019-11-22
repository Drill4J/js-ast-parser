// var walkSync = function(dir, filelist) {
//     var fs = fs || require('fs'),
//         files = fs.readdirSync(dir);
//     filelist = filelist || [];
//     files.forEach(function(file) {
//       if (fs.statSync(dir + '/' + file).isDirectory()) {
//         filelist = walkSync(dir + '/' + file, filelist);
//       }
//       else {
//         filelist.push(file);
//       }
//     });
//     return filelist;
//   };

// console.log(walkSync("/home/sergey/Github/timecoder-ui/src/app", []).filter(it => it.endsWith(".ts")))

var recursive = require("recursive-readdir");

recursive("/home/sergey/Github/timecoder-ui/src/app" ,["*.css", "*.html", "*.js"], function (err, files) {
  console.log(files);
});