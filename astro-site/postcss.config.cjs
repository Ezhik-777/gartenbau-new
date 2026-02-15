module.exports = {
  plugins: {
    'cssnano': {
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
        normalizeWhitespace: true,
        minifyFontValues: true,
        minifyGradients: true,
        mergeLonghand: true,
        mergeRules: true,
        reduceIdents: false, // Keep custom properties
        zindex: false, // Don't optimize z-index
      }]
    }
  }
};
