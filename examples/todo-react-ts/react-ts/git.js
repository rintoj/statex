/* eslint-disable no-console */
const shell = require('shelljs');
const chalk = require('chalk');
const commandExists = require('command-exists');

const isWin = /^win/.test(process.platform);

module.exports = (function gitCommands() {
  const git = {};

  function run(command, target) {
    return new Promise((resolve, reject) => {
      if (target != null) {
        shell.cd(target);
      }
      shell.exec(`git ${command}`, {
        silent: true,
      }, (code, stdout, stderr) => {
        if (code !== 0) {
          console.log(chalk.red(`git ${command} <== FAILED`));
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
  git.run = run;

  function init(target) {
    return run('init', target);
  }
  git.init = init;

  function addAll(target) {
    return run('add --all', target);
  }
  git.addAll = addAll;

  function commit(message, target) {
    if (isWin) {
      return run(`commit -a -m "${message}"`, target);
    } else {
      return run(`commit -a -m '${message}'`, target);
    }
  }
  git.commit = commit;

  function isAvailable() {
    return commandExists(`git${isWin ? '.cmd' : ''}`);
  }
  git.isAvailable = isAvailable;

  return git;
}());
