module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['post']],
    'scope-empty': [2, 'always'],
  },
};
