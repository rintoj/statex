/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true}] */
/* eslint-disable no-console */
const fs = require('fs-extra');
const path = require('path');
const npm = require('./npm');
const git = require('./git');
const chalk = require('chalk');
const nameUtil = require('name-util');
const packageJson = require('../package.json');
const ProgressBar = require('progress');

const progress = new ProgressBar(':message', {
  total: Infinity,
});

function resolvePath(target) {
  return path.resolve(/^\.\.?\//.test(target) ? `../${target}` : target);
}

function isExists(target, expect) {
  return new Promise((resolve, reject) => {
    fs.access(target, fs.constants.R_OK, (err) => {
      if (expect) {
        if (err) {
          return reject(`Invalid path ${target}`);
        }
      } else if (!err) {
        return reject(`Path exists ${target}`);
      }
      return resolve(target);
    });
  });
}

function createTargetDir(target) {
  return new Promise((resolve, reject) => {
    fs.ensureDir(target, err => (err ? reject(err) : resolve(target)));
  });
}

function copyDirectory(source, target) {
  return new Promise((resolve, reject) => {
    fs.copy(source, target, err => (err ? reject(err) : resolve(target)));
  });
}

function copyPackageJson(target, name) {
  const updatedPackageJson = [
    'name', 'version',
  ].reduce((a, key) => {
    const update = {};
    if (key === 'name') {
      update[key] = name;
    } else if (key === 'version') {
      update[key] = '0.0.1';
    }
    return Object.assign({}, a, update);
  }, packageJson);

  return new Promise((resolve, reject) => {
    fs.writeJson(`${target}/package.json`, updatedPackageJson, err => (err ? reject(err) : resolve(target)));
  });
}

function copyIndex(target, name) {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${target}/src/index.tsx`, `
import './style/app.scss'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { App } from './app'

// hot load application state when in development mode
if (process.env.NODE_ENV === 'development') {
  require('../react-ts/hot-load')('${name}')
}

ReactDOM.render(<App />, document.getElementById('root'))
`, err => (err ? reject(err) : resolve()));
  });
}

function createGitIgnore(target, files) {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${target}/.gitignore`, files.join('\n'), err => (err ? reject(err) : resolve()));
  });
}

function printProgress(message, completed) {
  progress.tick({
    message: `  ${completed ? chalk.green('✓') : chalk.yellow('➟')} ${chalk.gray(message)}`,
  });

  return new Promise(resolve => setTimeout(() => {
    if (completed) console.log();
    resolve();
  }, 500));
}

function printError(error) {
  console.log();
  console.log();
  console.log(chalk.red(`ERROR: ${error}`));
}

function usage(name, noUsageInfo) {
  if (noUsageInfo) {
    console.log();
    printProgress(chalk.green('Completed'));
    return;
  }

  console.log(`

  Use the following commands to get started:

  ${chalk.gray('# go to the project folder')}
  ${chalk.yellow(`cd ${name}`)}

  ${chalk.gray('# install modules')}
  ${chalk.yellow('npm install')}          ${chalk.green('Install')} modules (run once)

  ${chalk.gray('# development')}
  ${chalk.yellow('npm start')}            ${chalk.green('Serve')} the project

  ${chalk.gray('# test')}
  ${chalk.yellow('npm test')}             Run ${chalk.green('test')} suite
  ${chalk.yellow('npm run tdd')}          Run ${chalk.green('test')} suite in watch mode
  ${chalk.yellow('npm run lint')}         Test for ${chalk.green('lint')} error

  ${chalk.gray('# build')}
  ${chalk.yellow('npm run build')}        Create ${chalk.green('production')} build
  ${chalk.yellow('npm run build:dev')}    Create ${chalk.green('development')} build

  `);
}

function initGit(target) {
  return new Promise((resolve) => {
    if (git.isAvailable()) {
      return Promise.resolve()
        .then(() => printProgress(`${chalk.green('Initialize git...')}`))
        .then(() => git.init(target))
        .then(() => git.addAll(target))
        .then(() => git.commit('Initial commit'))
        .then(() => printProgress('Initialize git', true))
        .then(resolve);
    }
    return printProgress(`Git not available... ${chalk.yellow('skipping init git')}`).then(resolve);
  });
}

function installNodeModules(target, run) {
  if (!run) return Promise.resolve();

  return Promise.resolve()
    .then(() => printProgress(`${chalk.green('Installing node modules...')} This may take time.`))
    .then(() => npm.install(target))
    .then(() => printProgress('Installing node modules', true));
}

module.exports = function createApp(name, options) {
  const config = Object.assign({
    installModules: false,
    noUsageInfo: true,
  }, options);

  const projectName = nameUtil.toDashedName(name.replace(/^[^a-z0-9]$/gi, ''));
  const source = resolvePath(`${__dirname}/..`);
  const target = resolvePath(projectName);

  console.log('');
  return Promise.resolve()
    .then(() => isExists(target))
    .then(() => printProgress('Creating target directory...'))
    .then(() => createTargetDir(target))
    .then(() => printProgress('Creating target directory', true))
    .then(() => printProgress('Creating project files... '))
    .then(() => copyDirectory(source, target))
    .then(() => copyPackageJson(target, name))
    .then(() => copyIndex(target, name))
    .then(() => printProgress('Creating project files', true))
    .then(() => createGitIgnore(target, ['node_modules/', 'coverage/', 'dist/']))
    .then(() => initGit(target))
    .then(() => installNodeModules(target, config.installModules))
    .then(() => usage(projectName, config.noUsageInfo))
    .catch(printError);
};
