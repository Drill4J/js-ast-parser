module.exports = {
  // roots: ['<rootDir>/src'],
  // testMatch: ["<rootDir>/src/**/*(*.)@(spec|test).[tj]s?(x)"], // config for .spec files placed next to .ts files
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testMatch: ["**/__tests__/unit/**/spec.+(ts|tsx|js)"],
  moduleFileExtensions: ['ts', 'js'],
}
