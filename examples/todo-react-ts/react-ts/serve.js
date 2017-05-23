/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true}] */
/* eslint-disable no-console */

const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

module.exports = function serve(port, host) {
  const targetHost = host || 'localhost';
  const targetPort = port || 8080;

  process.env.NODE_ENV = 'development';
  process.env.HOST = targetHost;
  process.env.PORT = targetPort;

  const webpackConfig = require('./webpack.config');
  const compiler = webpack(webpackConfig);
  const server = new WebpackDevServer(compiler, {
    hot: true,
    stats: {
      colors: true,
    },
  });

  server.listen(targetPort, targetHost, () => {
    console.log();
    console.log(chalk.gray(`Starting server at ${chalk.green(`http://${targetHost}:${targetPort}`)}`));
    console.log();
  });
};
