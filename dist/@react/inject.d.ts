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
export declare function inject(propsClass: Function): (targetComponent: any) => any;
