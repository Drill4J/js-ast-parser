module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testMatch: ["**/__tests__/unit/**/spec.+(ts|tsx|js)"],
  moduleFileExtensions: ['ts', 'js'],
  setupFilesAfterEnv: ["jest-extended"],
  globals: {
    "ts-jest": {
      tsConfig: './test.tsconfig.json'
    }
  }
}
