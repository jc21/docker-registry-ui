const webpack    = require('webpack');
const Visualizer = require('webpack-visualizer-plugin');
const config     = require('config');

module.exports = {
    resolve: {
        alias: {
            'tabler-core':      'tabler-ui/dist/assets/js/core',
            'bootstrap':        'tabler-ui/dist/assets/js/vendors/bootstrap.bundle.min',
            'sparkline':        'tabler-ui/dist/assets/js/vendors/jquery.sparkline.min',
            'selectize':        'tabler-ui/dist/assets/js/vendors/selectize.min',
            'tablesorter':      'tabler-ui/dist/assets/js/vendors/jquery.tablesorter.min',
            'vector-map':       'tabler-ui/dist/assets/js/vendors/jquery-jvectormap-2.0.3.min',
            'vector-map-de':    'tabler-ui/dist/assets/js/vendors/jquery-jvectormap-de-merc',
            'vector-map-world': 'tabler-ui/dist/assets/js/vendors/jquery-jvectormap-world-mill',
            'circle-progress':  'tabler-ui/dist/assets/js/vendors/circle-progress.min'
        }
    },
    context: __dirname + '/src/frontend/js',
    entry:   './main.js',
    output:  {
        filename:          'main.js',
        path:              __dirname + '/dist/js',
        publicPath:        '/js/',
        sourceMapFilename: 'dnBOUAwY76qx3MmZxtHn.map'
    },
    module:  {
        loaders: [
            {
                test:    /\.js$/,
                exclude: /node_modules((?!tabler).)*$/,
                loader:  'babel-loader', // 'babel-loader' is also a valid name to reference
                query:   {
                    presets: ['@babel/es2015']
                }
            },
            {
                test:   /\.ejs$/,
                loader: 'ejs-loader'
            },
            // Shims for tabler-ui
            {test: /assets\/js\/core/, loader: 'imports-loader?bootstrap'},
            {test: /jquery-jvectormap-de-merc/, loader: 'imports-loader?vector-map'},
            {test: /jquery-jvectormap-world-mill/, loader: 'imports-loader?vector-map'}
        ]
    },
    plugins: [
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        }),
        new webpack.ProvidePlugin({
            $:      'jquery',
            jQuery: 'jquery',
            _:      'underscore'
        }),
        new Visualizer({
            filename: '../../webpack_stats.html'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                unsafe:        true,
                drop_console:  config.util.getEnv('NODE_ENV') !== 'development',
                drop_debugger: config.util.getEnv('NODE_ENV') !== 'development',
                screw_ie8:     true,
                warnings:      false
            }
        })
    ]
};
