import * as React from 'react'

import { subscribe, unsubscribe } from '../core'

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

  return (targetComponent: any): any => {

    return class ObserverComponent extends React.PureComponent<any, any> {

      constructor(props) {
        super(props)
      }

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
