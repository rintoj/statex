import React from 'react'
import TodoItem from './todo-item'
import { inject } from 'statex/react'

@inject({
  filteredTodos: state => (state.todos || []).filter(todo => {
    if (state.filter === 'COMPLETED') return todo.completed
    if (state.filter === 'ACTIVE') return !todo.completed
    return true
  })
})
export default class TodoList extends React.Component {
  render() {
    const { filteredTodos } = this.props
    return (
      <ul id="todo-list">
        {(filteredTodos || []).map(
          todo => <TodoItem key={todo.id} todo={todo}></TodoItem>
        )}
      </ul>
    )
  }
}