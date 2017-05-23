/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true}] */
/* eslint-disable no-console */
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const clean = require('./clean');
const paths = require('./paths');
const webpack = require('webpack');
const copyPublicFolder = require('./copy');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');

module.exports = function buildProject(environment) {
  process.env.NODE_ENV = environment || process.env.NODE_ENV || 'production';

  const isProd = process.env.NODE_ENV === 'production';
  const useYarn = fs.existsSync(paths.yarnLockFile);
  const webpackConfig = require('./webpack.config');
  const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
  const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild;

  console.log();
  console.log(chalk.gray(`Creating ${chalk.yellow(isProd ? 'production' : 'development')} build...`));

  // Print out errors
  function printErrors(summary, errors) {
    console.log(chalk.red(summary));
    console.log();
    errors.forEach((err) => {
      console.log(err.message || err);
      console.log();
    });
  }

  // Create the production build and print the deployment instructions.
  function build(previousFileSizes) {
    return new Promise((resolve, reject) => {
      webpack(webpackConfig).run((err, stats) => {
        if (err) {
          printErrors('Failed to compile.', [err]);
          reject();
          process.exit(1);
        }

        if (stats.compilation.errors.length) {
          printErrors('Failed to compile.', stats.compilation.errors);
          reject();
          process.exit(1);
        }

        if (process.env.CI && stats.compilation.warnings.length) {
          printErrors('Failed to compile. When process.env.CI = true, warnings are treated as failures. Most CI servers set this automatically.', stats.compilation.warnings);
          reject();
          process.exit(1);
        }

        console.log(chalk.green('Compiled successfully.'));
        console.log();

        console.log('File sizes after gzip:');
        console.log();
        printFileSizesAfterBuild(stats, previousFileSizes);
        console.log();

        const publicUrl = paths.publicUrl;
        const publicPath = webpackConfig.output.publicPath;

        if (publicUrl && publicUrl.indexOf('.github.io/') !== -1) {
          console.log(`The ${chalk.cyan('build')} folder is ready to be deployed.`);
          console.log(`To publish it at ${chalk.green(publicUrl)}, run:`);
          console.log();
          console.log(`  ${chalk.cyan(useYarn ? 'yarn' : 'npm')} run deploy`);
          console.log();
        } else if (publicPath !== '/') {
          const buildPath = path.relative(process.cwd(), paths.dist);
          console.log(`The ${chalk.cyan(buildPath)} folder is ready to be deployed.`);
          console.log();
        } else {
          if (publicUrl) {
            console.log(`The project was built assuming it is hosted at ${chalk.green(publicUrl)}.`);
            console.log(`You can control this with the ${chalk.green('homepage')} field in your ${chalk.cyan('package.json')}.`);
            console.log();
          } else {
            console.log('The project was built assuming it is hosted at the server root.');
            console.log(`To override this, specify the ${chalk.green('homepage')} in your ${chalk.cyan('package.json')}.`);
            console.log('For example, add this to build it for GitHub Pages:');
            console.log();
            console.log(`  ${chalk.green('"homepage"')}${chalk.cyan(': ')}${chalk.green('"http://myname.github.io/myapp"')}${chalk.cyan(',')}`);
            console.log();
          }
          const buildPath = path.relative(process.cwd(), paths.dist);
          console.log(`The ${chalk.cyan(buildPath)} folder is ready to be deployed.`);
          console.log('You may serve it with a static server:');
          console.log();
          if (useYarn) {
            console.log(`  ${chalk.cyan('yarn')} global add serve`);
          } else {
            console.log(`  ${chalk.cyan('npm')} install -g serve`);
          }
          console.log(`  ${chalk.cyan('serve')} -s build`);
          console.log();
        }
        resolve();
      });
    });
  }

  // start building
  return measureFileSizesBeforeBuild(paths.dist)
    .then(previousFileSizes => clean()
      .then(() => build(previousFileSizes))
      .then(copyPublicFolder));
};
