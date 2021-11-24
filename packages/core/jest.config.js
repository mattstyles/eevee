module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
  // testRegex: "(src/**/.*.(test|spec)).(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  coveragePathIgnorePatterns: ["/node_modules/", "/lib/"],
};
