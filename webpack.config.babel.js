import 'babel-polyfill';
import webpack from 'webpack';
import dotenv from 'dotenv';
import copyWebpackPlugin from 'copy-webpack-plugin';

const DEBUG = !process.argv.includes('--release');
const VERBOSE = !process.argv.includes('--verbose');

dotenv.config();
const env = process.env;

export default {
  cache: DEBUG,
  debug: DEBUG,

  target: 'web',

  stats: {
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE
  },

  devtool: DEBUG && 'inline-source-map',
  entry: __dirname + '/src/app.js',

  output: {
    path: __dirname + '/dist',
    filename: 'app.js'
  },

  devServer: {
    contentBase: 'dist',
    port: 8000
  },

  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules|libs/,
        loader: 'jshint-loader'
      }
    ],

    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }, {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
      }, {
        test: /\.jade$/,
        loader: 'pug-loader'
      }, {
        test: /\.(png|svg|eot|ttf|woff)(\?.*)?$/,
        loader: 'file?name=/assets/[name].[ext]'
      }
    ]
  },

  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: VERBOSE
      }
    }),

    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Vue: 'vue'
    }),

    new copyWebpackPlugin([
      {
        from: 'node_modules/flat-ui/images/icons/png',
        to: 'assets/icons'
      }, {
        from: 'assets/',
        to: 'assets/faces'
      }
    ]),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env.NODE_ENV),
        apiServerUrl: (() => {
          return JSON.stringify(
            (env.NODE_ENV === "production") ?
              env.PRODUCTION_SERVER :
              env.DEVELOPMENT_SERVER
            )
        })()
      }
    })
  ],

  resolve: {
    modulesDirectories: [
      "node_modules", "libs"
    ]
  }
};
