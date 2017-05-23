import { REFLUX_ACTION_KEY } from './constance'

/**
 * Use reflection library
 */
declare var Reflect: any

/**
 * This decorator configure instance of a store
 *
 * @export
 * @param {*} storeClass
 * @returns
 */
export function store(storeClass: any) {
  // save a reference to the original constructor
  let original = storeClass

  // a utility function to generate instances of a class
  function construct(constructor, args) {
    let dynamicClass: any = function () {
      return constructor.apply(this, args)
    }
    dynamicClass.prototype = constructor.prototype
    return new dynamicClass()
  }

  // the new constructor behavior
  let overriddenConstructor: any = function overriddenConstructor(...args) {
    if (!Reflect.hasMetadata(REFLUX_ACTION_KEY, this)) return
    let refluxActions = Reflect.getMetadata(REFLUX_ACTION_KEY, this)
    Object.keys(refluxActions).forEach(name => new refluxActions[name]().subscribe(this[name], this))
    return construct(original, args)
  }

  // copy prototype so instanceof operator still works
  overriddenConstructor.prototype = original.prototype

  // create singleton instance
  const instance = new overriddenConstructor()

  // return new constructor (will override original)
  return instance && overriddenConstructor
}