import * as React from 'react'

import { AppState, Todo } from '../../state'
import { data, inject } from 'statex/react'

import { TodoItem } from '..'

class Props {
  @data((state: AppState) => (state.todos || []).filter(todo => {
    if (state.filter === 'COMPLETED') return todo.completed
    if (state.filter === 'ACTIVE') return !todo.completed
    return true
  }))
  filteredTodos?: Todo[]
}

interface State { }

@inject(Props)
export class TodoList extends React.Component<Props, State> {
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