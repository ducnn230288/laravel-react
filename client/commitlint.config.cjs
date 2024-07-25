module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['post']],
    'scope-min-length': [2, 'always', 1],
  },
};
