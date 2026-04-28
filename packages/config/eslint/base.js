/** @type {import('eslint').Linter.Config} */
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/design-system/**'],
            message: 'Import from @charts-gen/ui instead of directly from design-system.',
          },
        ],
      },
    ],
  },
};
