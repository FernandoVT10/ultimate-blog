/* eslint-disable */
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  displayName: "server",
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "./",
  moduleNameMapper: {
    "@app/(.*)": "<rootDir>/src/$1"
  },
  setupFilesAfterEnv: [
    "<rootDir>/test/setupTests.ts",
    "<rootDir>/test/teardownTests.ts"
  ],
};
