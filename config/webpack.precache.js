let SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

module.exports = {
	navigateFallback         : 'dist/index.html',
	navigateFallbackWhitelist: [/^(?!\/__#)/], // <-- necessary for Firebase OAuth
	root                     : '/',
	plugins                  : [
		new SWPrecacheWebpackPlugin({
			cacheId        : 'aisales',
			filename       : 'service-worker.js',
			staticFileGlobs: [				
				'index.html',
				'**.js',
				'**.css'
			],
			stripPrefix       : 'assets/',
			mergeStaticsConfig: true // if you don't set this to true, you won't see any webpack-emitted assets in your serviceworker config
		}),
	]
};
