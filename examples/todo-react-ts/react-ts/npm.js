/* eslint-disable no-console */
const shell = require('shelljs');
const chalk = require('chalk');
const commandExists = require('command-exists');

const isWin = /^win/.test(process.platform);

module.exports = (function npmCommands() {
  const npm = {};

  function run(command, target) {
    return new Promise((resolve, reject) => {
      if (target != null) {
        shell.cd(target);
      }
      shell.exec(`npm${isWin ? '.cmd' : ''} ${command}`, {
        silent: true,
      }, (code, stdout, stderr) => {
        if (code !== 0) {
          console.log(chalk.red(`npm ${command} <== FAILED`));
          console.log(chalk.red(`${stderr}`));
          console.log();
          return reject({
            exitCode: code,
          });
        }
        return resolve();
      });
    });
  }
  npm.run = run;

  function link(source, target) {
    return run(`link ${source}`, target);
  }
  npm.link = link;

  function unlink(source, target) {
    return run(`unlink ${source}`, target);
  }
  npm.unlink = unlink;

  function install(target) {
    return run('install', target);
  }
  npm.install = install;

  function build(target) {
    return run('run build', target);
  }
  npm.build = build;

  function isAvailable() {
    return commandExists(`npm${isWin ? '.cmd' : ''}`);
  }
  npm.isAvailable = isAvailable;

  return npm;
}());
