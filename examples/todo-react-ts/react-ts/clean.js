/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true}] */
/* eslint-disable no-console */
const fs = require('fs-extra');
const paths = require('./paths');

module.exports = function clean() {
  return new Promise((resolve, reject) => {
    fs.emptyDir(paths.dist, (error) => {
      if (error) {
        reject('error');
        return;
      }
      resolve();
    });
  });
};
