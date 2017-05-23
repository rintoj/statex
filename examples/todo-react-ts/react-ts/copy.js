/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true}] */
/* eslint-disable no-console */
const fs = require('fs-extra');
const paths = require('./paths');

module.exports = function copyPublicFolder() {
  fs.copySync(paths.assets, `${paths.dist}/assets`, {
    dereference: true,
    filter: file => /.*(index|splash)\.html$/.test(file) === false,
  });
};
