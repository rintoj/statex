import * as React from 'react'

import { RemoveTodoAction, ToggleTodoAction } from '../../action'

import { Todo } from '../../state'

interface Props {
  todo?: Todo
}

interface State {
  todo?: Todo
}

export class TodoItem extends React.Component<Props, State> {

  constructor(props) {
    super(props)
  }

  onChange = (event) => {
    new ToggleTodoAction(this.props.todo.id, event.target.checked).dispatch()
  }

  removeItem = () => {
    new RemoveTodoAction(this.props.todo.id).dispatch()
  }

  render() {
    const { todo } = this.props
    return (
      <li>
        <input className="toggle" type="checkbox" checked={todo.completed || false} onChange={this.onChange} />
        <label>{todo.text}</label>
        <button className="destroy" onClick={this.removeItem}></button>
      </li>
    )
  }
}