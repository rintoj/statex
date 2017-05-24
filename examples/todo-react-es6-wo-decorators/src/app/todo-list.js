import React from 'react'
import { State } from 'statex'
import TodoItem from './todo-item'

export default class TodoList extends React.Component {

  subscriptions = []

  constructor(props) {
    super(props)
    this.state = {
      filteredTodos: []
    }
  }

  componentDidMount() {
    this.subscriptions.push(
      State.select(state => (state.todos || []).filter(todo => {
        if (state.filter === 'COMPLETED') return todo.completed
        if (state.filter === 'ACTIVE') return !todo.completed
        return true
      }))
      .subscribe(filteredTodos => this.setState({ filteredTodos }))
    )
  }

  componentWillUnmount() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
    this.subscriptions = []
  }

  render() {
    const { filteredTodos } = this.state
    return (
      <ul id="todo-list">
        {(filteredTodos || []).map(
          todo => <TodoItem key={todo.id} todo={todo}></TodoItem>
        )}
      </ul>
    )
  }
}