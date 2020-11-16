const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // очищение папки перед сборкой
const HtmlWebpackPlugin = require('html-webpack-plugin'); // основной плагин для работы с HTML-файлами
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin'); // инлайн svg файлов в html, нужен тест
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // вывод отдельного css файла
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin'); // для копирования файлов
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin'); // минификация картинокnom

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin(),
    ];
  }

  return config;
};

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[fullhash].${ext}`);

module.exports = {
  context: path.resolve(__dirname, 'src'),

  entry: {
    main: './pages/index.js',
  },

  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },

  optimization: optimization(),
  devtool: isDev ? 'source-map' : 'eval',

  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, 'dist'),
    open: true,
    compress: true,
    hot: true,
    port: 8080,
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Gem-Puzzle',
      template: 'pages/template.html',
      favicon: 'assets/favicon.ico',
      // filename: '[name].html',
    }),

    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
    new CopyPlugin({
      patterns: [{ from: 'assets/images/**', to: 'assets/img', flatten: true },
        { from: 'assets/sounds/**', to: 'assets/sounds', flatten: true }],
    }), // for fonts,img
    new HtmlWebpackInlineSVGPlugin(),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['mozjpeg', { quality: 75, progressive: true }],
          ['optipng', { optimizationLevel: 3 }],
          ['svgo', { plugins: [{ removeViewBox: false }] }],
        ],
      },
    }),
  ],

  module: {
    rules: [
      // JabaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
      // Styles
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      // Images
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      // fonts и SVG
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
    ],
  },
};
