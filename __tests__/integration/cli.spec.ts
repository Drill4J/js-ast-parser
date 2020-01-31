let path = require('path');
let exec = require('child_process').exec;

test('should parse files', async () => {
  let result = await cli(['-c'], '.');
  expect(result.code).toEqual(1);
  expect(result.stderr).toEqual(
    "error: option '-c, --config <path>' argument missing\n"
  );
});

test('should parse source', async () => {
  let result = await cli(
    ['-c', './__tests__/data/example/drill4j.config'],
    '.'
  );
  expect(result.code).toEqual(0);
  expect(result.stdout).toEqual(`-----
 Start parsing project example
-----
Parsing /__tests__/data/example/js/Application.ts
Parsing /__tests__/data/example/js/_all.ts
Parsing /__tests__/data/example/js/controllers/TodoCtrl.ts
Parsing /__tests__/data/example/js/directives/TodoBlur.ts
Parsing /__tests__/data/example/js/directives/TodoEscape.ts
Parsing /__tests__/data/example/js/directives/TodoFocus.ts
Parsing /__tests__/data/example/js/models/TodoItem.ts
Parsing /__tests__/data/example/js/services/TodoStorage.ts
Saving ast data...
Saving data to local disk function parseFiles(files) {
}
success!\n`);
});

function cli(args, cwd): Promise<any> {
  return new Promise(resolve => {
    exec(
      `node ${path.resolve('./dist/src/index')} ${args.join(' ')}`,
      { cwd },
      (error, stdout, stderr) => {
        resolve({
          code: error && error.code ? error.code : 0,
          error,
          stdout,
          stderr,
        });
      }
    );
  });
}
