module.exports = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/frontend"],
  testMatch: ["**/__tests__/**/*.test.ts?(x)", "**/__tests__/**/*.test.tsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/frontend/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/frontend/jest.setup.ts"],
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/"],
};
