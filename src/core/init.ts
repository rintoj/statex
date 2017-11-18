import * as Immutable from 'seamless-immutable'

import { State } from './state'

export interface InitOptions {
  hotLoad?: boolean
  domain?: string
}

export function initialize(initialState: any, options?: InitOptions) {

  options = options || { domain: 'default' }

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