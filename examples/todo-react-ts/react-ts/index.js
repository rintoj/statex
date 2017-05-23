#!/usr/bin/env node

const packageJson = require('../package.json');
const program = require('commander').version(packageJson.version || '0.0.1');
const createApp = require('./create-app');

function registerCommand(command, description, callback) {
  program.command(command).description(description).action(callback);
}

registerCommand('create <name>', 'Create react application with TypeScript and WebPack', name => createApp(name, {
  installModules: false,
  noUsageInfo: false,
}));
registerCommand('serve [port]', 'Serve the project', port => require('./serve')(port));
registerCommand('build [environment]', 'Build the project', environment => require('./build')(environment));

program.action(() => {
  program.help();
});

program.parse(process.argv);

if (program.args.length === 0) {
  program.help();
}
