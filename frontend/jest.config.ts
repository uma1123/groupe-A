import type { Config } from "jest";

const config: Config = {
  // Use Babel to transform TS/TSX via babel-jest
  testEnvironment: "jsdom",
  roots: ["<rootDir>"],
  testMatch: ["**/__tests__/**/*.test.ts?(x)", "**/__test__/**/*.test.ts?(x)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
};

export default config;
