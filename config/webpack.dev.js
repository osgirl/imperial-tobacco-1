let webpackMerge = require('webpack-merge');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let commonConfig = require('./webpack.common.js');
let helpers = require('./helpers');
let webpack = require('webpack');

module.exports = webpackMerge(commonConfig, {
	devtool: 'cheap-module-eval-source-map',

	output: {
		path         : helpers.root('client', 'dist'),
		publicPath   : '/',
		filename     : '[name].js',
		chunkFilename: '[id].chunk.js'
	},

	plugins: [
		new ExtractTextPlugin('[name].css'),
		new webpack.HotModuleReplacementPlugin()
	],

	devServer: {
		historyApiFallback: true,
		stats             : 'minimal',
		port              : 8080,
		proxy             : {
			'/': {
				target: 'http://localhost:3002',
				secure: false
			},
			'/isAuth': {
				target: 'http://localhost:3002',
				secure: false
			},
			'/login': {
				target: 'http://localhost:3002',
				secure: false
			},
			'/logout': {
				target: 'http://localhost:3002',
				secure: false
			},
			'/src/assets/*': {
				target: 'http://localhost:3002',
				secure: false
			}
		}
	}
});
