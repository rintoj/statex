import * as React from 'react'

import { subscribe, unsubscribe } from '../core'

import { STATEX_DATA_BINDINGS_KEY } from './../core/constance'

/**
 * This decorator helps you to inject application state into a component's state
 * @example
 *
 * class Props {
 *   @data((state: AppState) => state.todos)
 *   todos: Todo[]
 * }
 *
 * interface Props { }
 *
 * @inject(Props)
 * export class TodoListComponent extends React.Component<Props, State> {
 *   ...
 * }
 *
 * @export
 * @param {*} props - Component properties class annotated with @data
 * @returns
 */
export function inject(propsClass: Function) {

  if (typeof propsClass === 'object') {
    let bindingsMeta = Reflect.getMetadata(STATEX_DATA_BINDINGS_KEY, propsClass)
    if (!Reflect.hasMetadata(STATEX_DATA_BINDINGS_KEY, propsClass)) {
      bindingsMeta = { selectors: {}, subscriptions: [], destroyed: true }
    }
    Object.keys(propsClass).forEach(propertyKey => {
      if (typeof propsClass[propertyKey] !== 'function') {
        throw new Error(`${propertyKey} must be a selector function!`)
      }
      bindingsMeta.selectors[propertyKey] = propsClass[propertyKey]
    })
    Reflect.defineMetadata(STATEX_DATA_BINDINGS_KEY, bindingsMeta, propsClass)
  }

  return (targetComponent: any): any => {

    return class ObserverComponent extends React.PureComponent<any, any> {

      componentDidMount() {
        subscribe.bind(this)(propsClass)
      }

      componentWillUnmount() {
        unsubscribe.bind(this)()
      }

      render() {
        return React.createElement(targetComponent, { ...this.props, ...this.state })
      }
    }
  }
}
