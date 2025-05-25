const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: tsJestTransformCfg,
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  /*setupFiles: [
    "/Users/rock/Documents/Projekti/project-manager/client/jest.setup.js",
  ], // ✅ points to your override*/
};
