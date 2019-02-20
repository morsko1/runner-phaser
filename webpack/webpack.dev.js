const merge = require('webpack-merge');
const common = require('./webpack.common');

const dev = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        open: true,
        noInfo: true,
        host: '192.168.31.226'
    }
}

module.exports = merge(common, dev);
