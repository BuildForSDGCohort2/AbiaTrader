module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        useBuiltIns: true,
      },

    ],
  ],
  plugins: ["@babel/plugin-syntax-bigint", "@babel/plugin-transform-runtime"]
};
