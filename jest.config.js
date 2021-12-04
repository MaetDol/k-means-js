module.exports = {
  "transform": {
    "^.+\\.[mc]?[tj]sx?$": "babel-jest"
  },
  "projects": [{
    "testMatch": ["<rootDir>/index.test.js"]
  }]
};