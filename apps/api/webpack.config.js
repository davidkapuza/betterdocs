const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/api'),
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: join(__dirname, '../../tsconfig.base.json'), // point to the root tsconfig because plugin is unable to resolve ${configDir} notation
        extensions: ['.ts', '.js'],
        mainFields: ['module', 'main'],
      }),
    ],
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets', './src/modules/mail/templates'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
      transformers: [
        {
          name: '@nestjs/graphql/plugin',
          options: {
            introspectComments: true,
            typeFileNameSuffix: [
              '.input.ts',
              '.inputs.ts',
              '.args.ts',
              '.entity.ts',
              '.entities.ts',
              '.model.ts',
              '.models.ts',
            ],
          },
        },
      ],
    }),
  ],
};
