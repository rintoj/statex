import Immutable from './immutable'

import { State } from './state'
import { Action } from './action'

export interface InitOptions {
  hotLoad?: boolean
  cache?: string
  showError?: boolean
  domain?: string
}

export function initialize(initialState: any, options?: InitOptions) {

  options = options || { domain: 'default' }
  Action.showError = options.showError

  const cacheKey = `statex-cache:${options.domain}`

  if (options.hotLoad === true && options.cache != undefined) {
    // for nodejs / electron projects
    const fs = require('fs')
    const cacheFile = require('path').resolve(process.cwd(), options.cache)
    try { State.next(Immutable.from(JSON.parse(fs.readFileSync(cacheFile) || 'null') || initialState)) } catch (e) { /* ignore error */ }
    State.subscribe(state => fs.writeFileSync(cacheFile, JSON.stringify(state)), error => console.error(error), undefined)

  } else if (options.hotLoad === true && typeof localStorage !== 'undefined') {
    // for dev builds in browser
    State.next(Immutable.from(JSON.parse(localStorage.getItem(cacheKey) || 'null') || initialState))
    State.subscribe(state => localStorage.setItem(cacheKey, JSON.stringify(state)), error => console.error(error), undefined)

  } else if (initialState != undefined) {
    // for production
    State.next(Immutable.from(initialState))
  }

}