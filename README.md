# AST-parser (drill4js-cli utility)

## Production build

1. Run

  ```shell
      set NODE_ENV=production&& npx webpack --config webpack.config.js && rm -rf node_modules && npm i --only=prod && npm prune --production && npm shrinkwrap
  ```

## Release

To release a new package version:

  1. Bump version in `package.json` manually
  2. Run commands from **Production build** section
  3. Run `npm publish --dry-run`:

      - ensure that only necessary files are listed in package preview

      - ensure that `npm-shrinkwrap.json` **does not include development dependencies**

  4. Run `npm publish`

## Development build & debug

1. Install development dependencies

    ```shell
      rm -rf node_modules
      npm i
    ```

2. Run webpack development server

    ```shell
      npm run dev
    ```

3. Attach debugger to the process started with `npm run dev`

    > VScode:

      - Run `Debug on fixtures` launch configuration
      - Edit configuration to debug on different files

    > Other IDEs:

      - Attach debugger of your choice to the running process, use .vscode/launch.json `Debug on fixtures` configuration as the example
