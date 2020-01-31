let path = require('path');
let exec = require('child_process').exec;

test('Code should be 0', async () => {
  let result = await cli(['-v'], '.');
  expect(result.code).toEqual(0);
  expect(result.stdout).toEqual('Current version 0.2.6\n');
});

test('should parse files', async () => {
  let result = await cli(['-c'], '.');
  expect(result.code).toEqual(1);
  expect(result.stderr).toEqual(
    "error: option '-c, --config <path>' argument missing\n"
  );
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
