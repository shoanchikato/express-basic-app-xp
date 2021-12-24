module.exports = {
  collectCoverageFrom: [
    "src/**/*.js",
    "!**/src/db/**",
    "!**/src/middleware/**",
    "!**/src/di/**",
    "!**/src/error/**",
    "!**/src/model/**",
    "!**/src/constants/**",
    "!**/src/index.js",
  ],
};
