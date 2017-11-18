import { STATEX_ACTION_KEY } from '../core/constance'

/**
 * Use reflection library
 */
declare var Reflect: any

/**
 * Extend this class to create a store
 *
 * @export
 * @class Store
 */
export class Store {
  constructor() {
    if (!Reflect.hasMetadata(STATEX_ACTION_KEY, this)) return
    let statexActions = Reflect.getMetadata(STATEX_ACTION_KEY, this)
    Object.keys(statexActions).forEach(name => new statexActions[name]().subscribe(this[name], this))
  }
}