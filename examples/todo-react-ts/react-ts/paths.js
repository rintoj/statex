const path = require('path');

function resolvePath(relativePath) {
  return path.resolve(`${__dirname}/../${relativePath}`);
}

module.exports = {
  appModule: resolvePath('./src/index.tsx'),
  template: resolvePath('src/assets/index.html'),
  splash: resolvePath('src/assets/splash.html'),
  assets: resolvePath('src/assets'),
  dist: resolvePath('dist'),
  publicUrl: './',
  nodeModules: resolvePath('node_modules'),
};
