const { BASE_URL } = process.env;
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: BASE_URL,
        changeOrigin: true
      }
    }
  },
  // configWebpack : Object | Function(根据环境来配置，接收被解析的配置作为参数。该函数及可以修改配置并不返回任何东西)
  // 调整Webpack配置
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 生产环境配置
      config.devtool = 'nosources-source-map';

      const CompressionWebpackPlugin = require('compression-webpack-plugin');
      config.plugins.push(
        new CompressionWebpackPlugin()
      );
    } else if (process.env.NODE_ENV === 'analyzer') {
      // 有点问题没有用
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
      config.plugins.push(new BundleAnalyzerPlugin());
    }
  },
  // 链式操作(高级),允许我们更细粒度的控制其内部配置
  chainWebpack: config => {

  }
};
