import React from 'react'
import TodoItem from './todo-item'

// import { data, inject } from 'statex/react'

// class Props {
//   @data((state: AppState) => (state.todos || []).filter(todo => {
//     if (state.filter === 'COMPLETED') return todo.completed
//     if (state.filter === 'ACTIVE') return !todo.completed
//     return true
//   }))
//   filteredTodos?: Todo[]
// }

// interface State { }

// @inject(Props)
export class TodoList extends React.Component {
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