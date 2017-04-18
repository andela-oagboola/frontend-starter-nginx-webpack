const Webpack = require('webpack');
const path = require('path');
const Purify = require('purifycss-webpack-plugin');
const Extract = require('extract-text-webpack-plugin');
const Html = require('html-webpack-plugin');
const Clean = require('clean-webpack-plugin');

/* Base Config
 *  * ------------------------------------- */
const entry = './components/index.js';
const output = {
    path: path.join(__dirname, '/_build'),
    filename: '[hash].js',
};

/* Loaders
 *  * ------------------------------------- */
const loaders = [
    { test: /\.js$/, loader: 'ng-annotate!babel', exclude: /node_modules/ },
    { test: /\.html$/, loader: 'raw', exclude: /node_modules/ },
];

if (process.env.NODE_ENV === 'development') {
    loaders.push({ test: /\.css$/, loader: 'style!css' });
    loaders.push({ test: /\.scss$/, loader: 'style!css!sass', exclude: /node_modules/ });
}

if (process.env.NODE_ENV === 'production') {
    loaders.push({ test: /\.css/, loader: Extract.extract('style-loader', 'css-loader'), exclude: /node_modules/ });
    loaders.push({ test: /\.scss$/, loader: Extract.extract('style-loader', 'css-loader!sass-loader'), exclude: /node_modules/ });
}


/* Plugins
 *  * ------------------------------------- */
const plugins = [];
plugins.push(new Webpack.DefinePlugin({
    ON_DEV: process.env.NODE_ENV === 'development',
    ON_TEST: process.env.NODE_ENV === 'test',
    ON_PRODUCTION: process.env.NODE_ENV === 'production',
}));

plugins.push(new Clean(['_build'], { exclude: ['assets'] }));
plugins.push(new Html({ template: 'components/index.html' }));

if (process.env.NODE_ENV === 'production') {
    plugins.push(new Extract('[hash].css'));
    plugins.push(new Webpack.optimize.UglifyJsPlugin());
    plugins.push(new Purify({
        basePath: __dirname,
        resolveExtensions: ['.html'],
        paths: [
            'views/*.html',
            'directives/*.html',
        ],
        purifyOptions: {
            minify: true,
            info: true,
            rejected: true,
            whitelist: ['.loading', '.modal-visible', '.has-danger', '.form-control-danger', '.fa-sort-up', '.fa-sort-down', '.table-success', '.fa-chevron-down', '.right', '.form-inline', '.row', '.col-xs-4', '.active', '.collapse', '.disabled', '.icon', '.fa-remove', '.fa-search', '.bg-success', '.btn-success', '.open', '.btn-disabled', '.toast-title', '.toast-message', '.toast-message a', '.toast-message label', '.toast-message a:hover', '.toast-close-button', '.toast-close-button:focus', '.toast-close-button:hover', 'button.toast-close-button', '.toast-top-center', '.toast-bottom-center', '.toast-top-full-width', '.toast-bottom-full-width', '.toast-top-left', '.toast-top-right', '.toast-bottom-right', '.toast-bottom-left', '#toast-container', '#toast-container *', '#toast-container .toast', '#toast-container .toast:hover', '#toast-container .toast.toast-info', '#toast-container .toast.toast-error', '#toast-container .toast.toast-success', '#toast-container .toast.toast-warning', '#toast-container.toast-bottom-center .toast', '#toast-container.toast-top-center .toast', '#toast-container.toast-bottom-full-width .toast', '#toast-container.toast-top-full-width .toast', '.toast', '.toast-success', '.toast-error', '.toast-info', '.toast-warning', 'div[toast].ng-leave', 'div[toast].ng-leave.ng-leave-active', '#toast-container .toast.div', '#toast-container .toast-close-button', '#toast-container .toast.div', '#toast-container .toast-close-button', '#toast-container .toast.div'],
        },
    }));
}


module.exports = {
    entry,
    output,
    module: {
        loaders,
    },
    plugins,
};
