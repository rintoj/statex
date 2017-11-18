import * as Immutable from 'seamless-immutable'

import { State } from './state'
import { Action } from './action'

export interface InitOptions {
  hotLoad?: boolean
  showError?: boolean
  domain?: string
}

export function initialize(initialState: any, options?: InitOptions) {

  options = options || { domain: 'default' }
  Action.showError = options.showError

  const cacheKey = `statex-cache:${options.domain}`

  if (options.hotLoad) {
    // for dev builds
    State.next(Immutable.from(JSON.parse(
      localStorage.getItem(cacheKey) || 'null'
    ) || initialState))

    State.subscribe(
      state => localStorage.setItem(cacheKey, JSON.stringify(state)),
      error => console.error(error), undefined
    )

  } else if (initialState != undefined) {
    // for production
    State.next(Immutable.from(initialState))
  }

}