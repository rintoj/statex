const fs = require('fs-extra')
const path = require('path')
const resolvable = require('resolvable')

const remove = resolvable(fs.remove)

function clean() {
  return Promise.resolve()
    .then(() => remove(path.resolve('dist')))
    .then(() => remove(path.resolve('electron.js')))
    .then(() => remove(path.resolve('electron.d.ts')))
    .then(() => remove(path.resolve('react.js')))
    .then(() => remove(path.resolve('react.d.ts')))
    .then(() => remove(path.resolve('angular.js')))
    .then(() => remove(path.resolve('angular.d.ts')))
}

Promise.resolve()
  .then(() => clean())
  .catch((error) => console.log(error))