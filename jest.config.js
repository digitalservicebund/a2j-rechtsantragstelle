module.exports = {
  testEnvironment: "jsdom",
  moduleDirectories: ["node_modules", "<rootDir>/app"],
  moduleNameMapper: {
    "~/(.*)": "<rootDir>/app/$1",
    "test/(.*)": "<rootDir>/test/$1",
  },
  preset: "ts-jest",
  setupFiles: ["<rootDir>/tests/setup.tests.ts"],
  setupFilesAfterEnv: ["<rootDir>/tests/setupAfterEnv.tests.js"],
};
