const fs = require('fs-extra')
const path = require('path')
const resolvable = require('resolvable')

const emptyDir = resolvable(fs.emptyDir)
const readFile = resolvable(fs.readFile)
const writeFile = resolvable(fs.writeFile)
const remove = resolvable(fs.remove)

function processFile(source, target) {
  return Promise.resolve()
    .then(() => readFile(path.resolve(source), 'utf8'))
    .then((content) => content.replace(/export \* from \'\.\//g, 'export * from \'./dist/'))
    .then((content) => content.replace(/require\("\.\//g, 'require("./dist/'))
    .then((content) => writeFile(path.resolve(target), content))
    .then(() => remove(path.resolve(source)))
}

Promise.resolve()
  .then(() => processFile('./dist/@react.js', './react.js'))
  .then(() => processFile('./dist/@react.d.ts', './react.d.ts'))
  .then(() => processFile('./dist/@angular.js', './angular.js'))
  .then(() => processFile('./dist/@angular.d.ts', './angular.d.ts'))
  .catch((error) => console.log(error))