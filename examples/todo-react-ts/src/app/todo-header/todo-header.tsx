import * as React from 'react'

import { AddTodoAction, ToggleAllTodosAction } from '../../action'
import { data, inject } from 'statex/react'

import { AppState } from '../../state'

class Props {
  @data((state: AppState) => (state.todos || []).reduce(
    (checked, todo) => checked && todo.completed, true)
  )
  allChecked?: boolean
}

interface State {
  todoText?: string
}

@inject(Props)
export class TodoHeader extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = { todoText: '' }
  }

  handleSubmit = (event) => {
    event.preventDefault()
    if (!this.state.todoText) return
    new AddTodoAction({ text: this.state.todoText }).dispatch()
    this.setState({ todoText: '' })
  }

  handleChange = (event) => {
    this.setState({ todoText: event.target.value })
  }

  toggleAll = (event) => {
    new ToggleAllTodosAction(!event.target.checked).dispatch()
  }

  render() {
    const { allChecked } = this.props
    return (
      <header id="header">
        <h1>todos</h1>
        <form id="todo-form" onSubmit={this.handleSubmit}>
          <input id="new-todo" placeholder="What needs to be done?" name="todo" autoFocus
            value={this.state.todoText} onChange={this.handleChange} autoComplete="off" />
        </form>
        <input id="toggle-all" type="checkbox" checked={!allChecked} onChange={this.toggleAll} />
      </header>
    )
  }
}