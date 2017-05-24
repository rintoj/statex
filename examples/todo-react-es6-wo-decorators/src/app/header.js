import { AddTodoAction, ToggleAllTodosAction } from '../action/todo-action'

import React from 'react'
import { State } from 'statex'

export default class Header extends React.Component {

  subscriptions = []

  constructor(props) {
    super(props)
    this.state = { todoText: '' }
  }

  componentDidMount() {
    this.subscriptions.push(
      State.select(state => (state.todos || []).filter(todo => todo.completed).length === (state.todos || []).length)
        .subscribe(allChecked => this.setState({ allChecked }))
    )
  }

  componentWillUnmount() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
    this.subscriptions = []
  }

  handleSubmit(event) {
    event.preventDefault()
    if (!this.state.todoText) return
    new AddTodoAction({ text: this.state.todoText }).dispatch()
    this.setState({ todoText: '' })
  }

  handleChange(event) {
    this.setState({ todoText: event.target.value })
  }

  toggleAll(event) {
    new ToggleAllTodosAction(!event.target.checked).dispatch()
  }

  render() {
    const { allChecked } = this.state
    return (
      <header id="header">
        <h1>todos</h1>
        <form id="todo-form" onSubmit={this.handleSubmit.bind(this)}>
          <input id="new-todo" placeholder="What needs to be done?" name="todo" autoFocus
            value={this.state.todoText} onChange={this.handleChange.bind(this)} autoComplete="off" />
        </form>
        <input id="toggle-all" type="checkbox" checked={!allChecked} onChange={this.toggleAll.bind(this)} />
      </header>
    )
  }
}