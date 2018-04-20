import Immutable from '../core/immutable'

import { Action } from '../core/action'
import { State } from '../core/state'
import { initialize as coreInitialize, InitOptions } from '../core/init'

export function initialize(initialState: any, options?: InitOptions) {

  options = options || { domain: 'default' }
  Action.showError = options.showError

  if (options.hotLoad === true && options.cache != undefined) {
    // for nodejs / electron projects
    const fs = require('fs')
    const cacheFile = require('path').resolve(process.cwd(), options.cache)
    try { State.next(Immutable.from(JSON.parse(fs.readFileSync(cacheFile) || 'null') || initialState)) } catch (e) { /* ignore error */ }
    State.subscribe(async (state) => {
      try {
        await fs.writeFile(cacheFile, JSON.stringify(state))
      } catch (e) {
        console.error(e)
      }
    }, error => console.error(error), undefined)

  } else {
    return coreInitialize(initialState.options)
  }

}