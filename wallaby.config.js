module.exports = wallaby => {
  return {
    testFramework: 'jest',
    files: [
      'package.json',
      'index.js',
      '!index.test.js'
    ],
    tests: [
      'index.test.js'
    ],
    env: {
      type: 'node',
      runner: 'node'
    },
    compilers: {
      '*.js': wallaby.compilers.babel()
    },
    setup(wallaby) {
      wallaby.testFramework.configure(require('./package.json').jest);
    }
  };
};
