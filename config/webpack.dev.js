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
				target: 'http://localhost:3000',
				secure: false
			},
			'/isAuth': {
				target: 'http://localhost:3000',
				secure: false
			},
			'/login': {
				target: 'http://localhost:3000',
				secure: false
			},
			'/signup/*': {
				target: 'http://localhost:3000',
				secure: false
			},
			'/invite': {
				target: 'http://localhost:3000',
				secure: false
			},
			'/activate/*': {
				target: 'http://localhost:3000',
				secure: false
			},
			'/getInvitedEmail': {
				target: 'http://localhost:3000',
				secure: false
			},
			'/add-new-user': {
				target: 'http://localhost:3000',
				secure: false
			},
			'/delete-user': {
				target: 'http://localhost:3000',
				secure: false
			},
			'/update-user': {
				target: 'http://localhost:3000',
				secure: false
			},
			'/get-all-users': {
				target: 'http://localhost:3000',
				secure: false
			},
			'/editProfile': {
				target: 'http://localhost:3000',
				secure: false
			},
			'/logout': {
				target: 'http://localhost:3000',
				secure: false
			},
			'/getMessages': {
				target: 'http://localhost:3000',
				secure: false
			},
			'/getRooms': {
				target: 'http://localhost:3000',
				secure: false
			},
			'/getAllClients': {
				target: 'http://localhost:3000',
				secure: false
			},
			'/uploadFile': {
				target: 'http://localhost:3000',
				secure: false
			},
			'/deletePhoto': {
				target: 'http://localhost:3000',
				secure: false
			},
			'/getAccounts': {
				target: 'http://localhost:3000',
				secure: false
			},
			'/getClient': {
				target: 'http://localhost:3000',
				secure: false
			},
			'/downloadDesktop/*': {
				target: 'http://localhost:3000',
				secure: false
			},
			'/auth/facebook/*': {
				target: 'http://localhost:3000',
				secure: false
			},
			'/auth/linkedin/*': {
				target: 'http://localhost:3000',
				secure: false
			},
			'/auth/vkontakte/*': {
				target: 'http://localhost:3000',
				secure: false
			},
			'/socket.io/*': {
				target: 'http://localhost:3000',
				secure: false,
				ws    : true
			},
			'/socket.io*': {
				target: 'ws://localhost:3000',
				secure: false,
				ws    : true
			},
			'/src/assets/*': {
				target: 'http://localhost:3000',
				secure: false
			}
		}
	}
});
