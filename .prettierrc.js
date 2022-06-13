module.exports = {
  semi: true,
  singleQuote: true,
  arrowParens: 'always',
  trailingComma: 'all',
  endOfLine: 'auto',
  importOrder: ['^react(-native)?$', '<THIRD_PARTY_MODULES>', '(.*).css$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['classProperties', 'jsx', 'typescript'],
};
