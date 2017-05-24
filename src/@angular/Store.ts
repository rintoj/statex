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
    let refluxActions = Reflect.getMetadata(STATEX_ACTION_KEY, this)
    Object.keys(refluxActions).forEach(name => new refluxActions[name]().subscribe(this[name], this))
  }
}