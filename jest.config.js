const config = {
  moduleDirectories: ["node_modules", "<rootDir>/app"],
  moduleNameMapper: {
    "~/(.*)": "<rootDir>/app/$1",
    "tests/(.*)": "<rootDir>/tests/$1",
    "data/(.*)": "<rootDir>/data/$1",
    "^.+\\.css$": "<rootDir>/tests/cssStub.js",
  },
  preset: "ts-jest",
  setupFiles: ["<rootDir>/tests/setup.tests.ts"],
  setupFilesAfterEnv: ["<rootDir>/tests/setupAfterEnv.tests.js"],
  resolver: "<rootDir>/tests/resolver.cjs",
};

export default config;
