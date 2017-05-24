import Filter from './filter'
import React from 'react'
import { RemoveCompletedTodosAction } from '../action/todo-action'
import { inject } from 'statex/react'

@inject({
  completedCount: state => (state.todos || []).filter(todo => todo.completed).length,
  pendingCount: state => (state.todos || []).filter(todo => !todo.completed).length
})
export default class Footer extends React.Component {

  clearCompleted() {
    new RemoveCompletedTodosAction().dispatch()
  }

  render() {
    const { pendingCount, completedCount } = this.props
    return (
      <footer id="footer">
        {pendingCount != null &&
          <span id="todo-count"><strong>{pendingCount} </strong>
            {pendingCount > 1 ? 'items' : 'item'} left
          </span>
        }
        <Filter />
        {completedCount > 0 &&
          <button id="clear-completed"
            onClick={this.clearCompleted.bind(this)}>Clear completed</button>
        }
      </footer>
    )
  }
}