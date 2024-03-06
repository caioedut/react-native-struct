module.exports = {
  plugins: ['@trivago/prettier-plugin-sort-imports'],

  arrowParens: 'always',
  endOfLine: 'auto',
  semi: true,
  singleQuote: true,
  trailingComma: 'all',

  // @trivago/prettier-plugin-sort-imports
  importOrder: ['^react(-native)?$', '<THIRD_PARTY_MODULES>', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['classProperties', 'jsx', 'typescript'],
};
