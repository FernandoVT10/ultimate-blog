const commonOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "./"
};

/* eslint-disable */
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  projects: [
    {
      displayName: "integration",
      testPathIgnorePatterns: ["./src/"],
      moduleNameMapper: {
        "@app/(.*)": "<rootDir>/src/$1"
      },
      setupFilesAfterEnv: ["./test/setupJest.ts"],
      ...commonOptions
    },
    {
      displayName: "unit",
      testPathIgnorePatterns: ["./test/"],
      ...commonOptions
    }
  ]
};
