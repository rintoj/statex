const fs = require('fs-extra')
const path = require('path')
const resolvable = require('resolvable')

const emptyDir = resolvable(fs.emptyDir)
const readFile = resolvable(fs.readFile)
const writeFile = resolvable(fs.writeFile)
const remove = resolvable(fs.remove)

function processFile(source, target, lib) {
  return Promise.resolve()
    .then(() => readFile(path.resolve(source), 'utf8'))
    .then((content) => content.replace(/export \* from \'\.\//g, 'export * from \'./dist/' + lib + '/'))
    .then((content) => content.replace(/export \* from \'\.\.\//g, 'export * from \'./dist/'))
    .then((content) => content.replace(/require\("\.\//g, 'require("./dist/' + lib + '/'))
    .then((content) => content.replace(/require\("\.\.\//g, 'require("./dist/'))
    .then((content) => writeFile(path.resolve(target), content))
}

Promise.resolve()
  .then(() => processFile('./dist/@react/index.js', './react.js', '@react'))
  .then(() => processFile('./dist/@react/index.d.ts', './react.d.ts', '@react'))
  .then(() => processFile('./dist/@angular/index.js', './angular.js', '@angular'))
  .then(() => processFile('./dist/@angular/index.d.ts', './angular.d.ts', '@angular'))
  .catch((error) => console.log(error))