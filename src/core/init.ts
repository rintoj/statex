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

  if (options.cache != undefined) {
    throw new Error('statex:initialize: Option cache is not supported. Import initialize from statex/electron to use cache option')
  }

  if (options.hotLoad === true && typeof localStorage !== 'undefined') {
    // for dev builds in browser
    State.next(Immutable.from(JSON.parse(localStorage.getItem(cacheKey) || 'null') || initialState))
    State.subscribe(state => localStorage.setItem(cacheKey, JSON.stringify(state)), error => console.error(error), undefined)

  } else if (initialState != undefined) {
    // for production
    State.next(Immutable.from(initialState))
  }

}