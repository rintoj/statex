import { RemoveTodoAction, ToggleTodoAction } from '../action/todo-action'

import React from 'react'

export default class TodoItem extends React.Component {

  onChange(event) {
    new ToggleTodoAction(this.props.todo.id, event.target.checked).dispatch()
  }

  removeItem() {
    new RemoveTodoAction(this.props.todo.id).dispatch()
  }

  render() {
    const { todo } = this.props
    return (
      <li>
        <input className="toggle" type="checkbox" checked={todo.completed || false} onChange={this.onChange.bind(this)} />
        <label>{todo.text}</label>
        <button className="destroy" onClick={this.removeItem.bind(this)}></button>
      </li>
    )
  }
}